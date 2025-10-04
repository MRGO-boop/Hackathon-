from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base

class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ApprovalRuleType(str, enum.Enum):
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    PERCENTAGE = "percentage"
    SPECIFIC_APPROVER = "specific_approver"
    HYBRID = "hybrid"

class ApprovalRule(Base):
    __tablename__ = "approval_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    rule_type = Column(Enum(ApprovalRuleType), nullable=False)
    is_active = Column(Boolean, default=True)
    minimum_approval_percentage = Column(Float, default=100.0)
    requires_manager_approval = Column(Boolean, default=True)
    approver_sequence_matters = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    company = relationship("Company", back_populates="approval_rules")
    created_by = relationship("User")
    approvers = relationship("ApprovalRuleApprover", back_populates="rule")
    workflows = relationship("ApprovalWorkflow", back_populates="rule")

class ApprovalRuleApprover(Base):
    __tablename__ = "approval_rule_approvers"
    
    id = Column(Integer, primary_key=True, index=True)
    sequence_order = Column(Integer, nullable=False)
    is_required = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    rule_id = Column(Integer, ForeignKey("approval_rules.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    rule = relationship("ApprovalRule", back_populates="approvers")
    approver = relationship("User")

class ApprovalWorkflow(Base):
    __tablename__ = "approval_workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    current_step = Column(Integer, default=1)
    total_steps = Column(Integer, nullable=False)
    completed_steps = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    rule_id = Column(Integer, ForeignKey("approval_rules.id"), nullable=False)
    
    # Relationships
    expense = relationship("Expense")
    rule = relationship("ApprovalRule", back_populates="workflows")
    approvals = relationship("Approval", back_populates="workflow")

class Approval(Base):
    __tablename__ = "approvals"
    
    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    comments = Column(Text)
    approved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    workflow_id = Column(Integer, ForeignKey("approval_workflows.id"), nullable=False)
    
    # Relationships
    expense = relationship("Expense", back_populates="approvals")
    approver = relationship("User", back_populates="approvals")
    workflow = relationship("ApprovalWorkflow", back_populates="approvals")
    
    def __repr__(self):
        return f"<Approval(id={self.id}, status='{self.status}', approver_id={self.approver_id})>"

