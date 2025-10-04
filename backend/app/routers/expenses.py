from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from app.database import get_db
from app.models.user import User
from app.models.expense import Expense, ExpenseCategory, ExpenseStatus
from app.models.company import Company
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseWithDetails, ExpenseCategoryCreate, ExpenseCategoryResponse
from app.core.dependencies import get_current_active_user, require_manager_or_admin
from app.services.currency_service import CurrencyService
from app.services.approval_service import ApprovalService

router = APIRouter()

@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[ExpenseStatus] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get expenses for current user."""
    query = db.query(Expense).filter(Expense.submitter_id == current_user.id)
    
    if status_filter:
        query = query.filter(Expense.status == status_filter)
    
    expenses = query.offset(skip).limit(limit).all()
    return expenses

@router.get("/company", response_model=List[ExpenseWithDetails])
async def get_company_expenses(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[ExpenseStatus] = None,
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Get all expenses in company (managers and admins only)."""
    query = db.query(Expense).filter(Expense.company_id == current_user.company_id)
    
    if status_filter:
        query = query.filter(Expense.status == status_filter)
    
    expenses = query.offset(skip).limit(limit).all()
    return expenses

@router.get("/pending-approvals", response_model=List[ExpenseWithDetails])
async def get_pending_approvals(
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Get expenses pending approval for managers."""
    # Get expenses that need approval from this user
    from app.models.approval import Approval, ApprovalStatus
    pending_approvals = db.query(Approval).filter(
        Approval.approver_id == current_user.id,
        Approval.status == ApprovalStatus.PENDING
    ).all()
    
    expense_ids = [approval.expense_id for approval in pending_approvals]
    expenses = db.query(Expense).filter(Expense.id.in_(expense_ids)).all()
    
    return expenses

@router.get("/{expense_id}", response_model=ExpenseWithDetails)
async def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get expense by ID."""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Check permissions
    if (current_user.role == "employee" and expense.submitter_id != current_user.id) or \
       (current_user.role == "manager" and expense.company_id != current_user.company_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return expense

@router.post("/", response_model=ExpenseResponse)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new expense."""
    # Convert currency to company default currency
    currency_service = CurrencyService()
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    
    exchange_rate = await currency_service.get_exchange_rate(
        expense_data.currency, 
        company.default_currency.value
    )
    
    amount_in_default_currency = expense_data.amount * Decimal(str(exchange_rate))
    
    db_expense = Expense(
        amount=expense_data.amount,
        currency=expense_data.currency,
        amount_in_default_currency=amount_in_default_currency,
        exchange_rate=Decimal(str(exchange_rate)),
        description=expense_data.description,
        expense_date=expense_data.expense_date,
        status=ExpenseStatus.DRAFT,
        submitter_id=current_user.id,
        company_id=current_user.company_id,
        category_id=expense_data.category_id
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    return db_expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update expense."""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Check permissions
    if expense.submitter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Can only update draft expenses
    if expense.status != ExpenseStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only update draft expenses"
        )
    
    # Update expense fields
    update_data = expense_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    db.commit()
    db.refresh(expense)
    
    return expense

@router.post("/{expense_id}/submit")
async def submit_expense(
    expense_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Submit expense for approval."""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Check permissions
    if expense.submitter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Can only submit draft expenses
    if expense.status != ExpenseStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only submit draft expenses"
        )
    
    # Update status and start approval workflow
    expense.status = ExpenseStatus.SUBMITTED
    
    # Start approval workflow
    approval_service = ApprovalService()
    await approval_service.start_approval_workflow(expense, db)
    
    db.commit()
    
    return {"message": "Expense submitted for approval"}

@router.get("/categories/", response_model=List[ExpenseCategoryResponse])
async def get_expense_categories(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get expense categories for company."""
    categories = db.query(ExpenseCategory).filter(
        ExpenseCategory.company_id == current_user.company_id,
        ExpenseCategory.is_active == True
    ).all()
    return categories

@router.post("/categories/", response_model=ExpenseCategoryResponse)
async def create_expense_category(
    category_data: ExpenseCategoryCreate,
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Create expense category."""
    db_category = ExpenseCategory(
        name=category_data.name,
        description=category_data.description,
        company_id=current_user.company_id
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category
