from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.audit_log import AuditAction

class AuditLogResponse(BaseModel):
    id: int
    action: AuditAction
    description: str
    old_values: Optional[Dict[str, Any]]
    new_values: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    user_agent: Optional[str]
    user_id: int
    expense_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuditLogCreate(BaseModel):
    action: AuditAction
    description: str
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    expense_id: Optional[int] = None

