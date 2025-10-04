from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.approval import Approval, ApprovalRule, ApprovalStatus
from app.schemas.approval import ApprovalCreate, ApprovalUpdate, ApprovalResponse, ApprovalRuleCreate, ApprovalRuleResponse, ApprovalRuleWithApprovers
from app.core.dependencies import get_current_active_user, require_manager_or_admin, require_admin
from app.services.approval_service import ApprovalService

router = APIRouter()

@router.get("/pending", response_model=List[ApprovalResponse])
async def get_pending_approvals(
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Get pending approvals for current user."""
    approvals = db.query(Approval).filter(
        Approval.approver_id == current_user.id,
        Approval.status == ApprovalStatus.PENDING
    ).all()
    return approvals

@router.post("/{approval_id}/approve", response_model=ApprovalResponse)
async def approve_expense(
    approval_id: int,
    comments: str = None,
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Approve an expense."""
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found"
        )
    
    # Check permissions
    if approval.approver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Approval is not pending"
        )
    
    # Update approval
    approval.status = ApprovalStatus.APPROVED
    approval.comments = comments
    approval.approved_at = datetime.utcnow()
    
    # Process approval workflow
    approval_service = ApprovalService()
    await approval_service.process_approval(approval, db)
    
    db.commit()
    db.refresh(approval)
    
    return approval

@router.post("/{approval_id}/reject", response_model=ApprovalResponse)
async def reject_expense(
    approval_id: int,
    comments: str,
    current_user: User = Depends(require_manager_or_admin),
    db: Session = Depends(get_db)
):
    """Reject an expense."""
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval not found"
        )
    
    # Check permissions
    if approval.approver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    if approval.status != ApprovalStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Approval is not pending"
        )
    
    # Update approval
    approval.status = ApprovalStatus.REJECTED
    approval.comments = comments
    approval.approved_at = datetime.utcnow()
    
    # Process rejection
    approval_service = ApprovalService()
    await approval_service.process_rejection(approval, db)
    
    db.commit()
    db.refresh(approval)
    
    return approval

@router.get("/rules/", response_model=List[ApprovalRuleWithApprovers])
async def get_approval_rules(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get approval rules for company."""
    rules = db.query(ApprovalRule).filter(
        ApprovalRule.company_id == current_user.company_id
    ).all()
    return rules

@router.post("/rules/", response_model=ApprovalRuleResponse)
async def create_approval_rule(
    rule_data: ApprovalRuleCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create approval rule."""
    db_rule = ApprovalRule(
        name=rule_data.name,
        description=rule_data.description,
        rule_type=rule_data.rule_type,
        minimum_approval_percentage=rule_data.minimum_approval_percentage,
        requires_manager_approval=rule_data.requires_manager_approval,
        approver_sequence_matters=rule_data.approver_sequence_matters,
        company_id=current_user.company_id,
        created_by_id=current_user.id
    )
    
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    
    # Add approvers
    for i, approver_id in enumerate(rule_data.approver_ids):
        from app.models.approval import ApprovalRuleApprover
        approver = ApprovalRuleApprover(
            rule_id=db_rule.id,
            approver_id=approver_id,
            sequence_order=i + 1
        )
        db.add(approver)
    
    db.commit()
    
    return db_rule

@router.put("/rules/{rule_id}", response_model=ApprovalRuleResponse)
async def update_approval_rule(
    rule_id: int,
    rule_data: ApprovalRuleCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update approval rule."""
    rule = db.query(ApprovalRule).filter(ApprovalRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval rule not found"
        )
    
    # Check permissions
    if rule.company_id != current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update rule fields
    update_data = rule_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != "approver_ids":
            setattr(rule, field, value)
    
    # Update approvers if provided
    if "approver_ids" in update_data:
        # Remove existing approvers
        db.query(ApprovalRuleApprover).filter(
            ApprovalRuleApprover.rule_id == rule_id
        ).delete()
        
        # Add new approvers
        for i, approver_id in enumerate(rule_data.approver_ids):
            from app.models.approval import ApprovalRuleApprover
            approver = ApprovalRuleApprover(
                rule_id=rule.id,
                approver_id=approver_id,
                sequence_order=i + 1
            )
            db.add(approver)
    
    db.commit()
    db.refresh(rule)
    
    return rule
