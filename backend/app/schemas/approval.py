from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.approval import ApprovalStatus, ApprovalRuleType

class ApprovalBase(BaseModel):
    comments: Optional[str] = None

class ApprovalCreate(ApprovalBase):
    expense_id: int

class ApprovalUpdate(ApprovalBase):
    status: ApprovalStatus

class ApprovalResponse(ApprovalBase):
    id: int
    status: ApprovalStatus
    approved_at: Optional[datetime]
    expense_id: int
    approver_id: int
    workflow_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ApprovalRuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    rule_type: ApprovalRuleType
    minimum_approval_percentage: float = 100.0
    requires_manager_approval: bool = True
    approver_sequence_matters: bool = False

class ApprovalRuleCreate(ApprovalRuleBase):
    approver_ids: List[int]

class ApprovalRuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    rule_type: Optional[ApprovalRuleType] = None
    minimum_approval_percentage: Optional[float] = None
    requires_manager_approval: Optional[bool] = None
    approver_sequence_matters: Optional[bool] = None
    approver_ids: Optional[List[int]] = None

class ApprovalRuleResponse(ApprovalRuleBase):
    id: int
    is_active: bool
    company_id: int
    created_by_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ApprovalRuleWithApprovers(ApprovalRuleResponse):
    approvers: Optional[List[dict]] = None

class ApprovalWorkflowResponse(BaseModel):
    id: int
    status: ApprovalStatus
    current_step: int
    total_steps: int
    completed_steps: int
    expense_id: int
    rule_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

