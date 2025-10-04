from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.expense import ExpenseStatus

class ExpenseBase(BaseModel):
    amount: Decimal
    currency: str
    description: str
    expense_date: datetime
    category_id: Optional[int] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    expense_date: Optional[datetime] = None
    category_id: Optional[int] = None
    status: Optional[ExpenseStatus] = None

class ExpenseResponse(ExpenseBase):
    id: int
    amount_in_default_currency: Decimal
    exchange_rate: Decimal
    status: ExpenseStatus
    submitter_id: int
    company_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ExpenseWithDetails(ExpenseResponse):
    submitter: Optional[dict] = None
    company: Optional[dict] = None
    category: Optional[dict] = None
    approvals: Optional[List[dict]] = None
    receipts: Optional[List[dict]] = None

class ExpenseCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ExpenseCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    company_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

