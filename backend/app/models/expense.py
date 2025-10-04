from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base

class ExpenseStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    company = relationship("Company")
    expenses = relationship("Expense", back_populates="category")

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False)  # ISO currency code
    amount_in_default_currency = Column(Float, nullable=False)
    exchange_rate = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    expense_date = Column(DateTime, nullable=False)
    status = Column(Enum(ExpenseStatus), default=ExpenseStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    submitter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("expense_categories.id"), nullable=True)
    
    # Relationships
    submitter = relationship("User", back_populates="submitted_expenses", foreign_keys=[submitter_id])
    company = relationship("Company", back_populates="expenses")
    category = relationship("ExpenseCategory", back_populates="expenses")
    approvals = relationship("Approval", back_populates="expense")
    receipts = relationship("Receipt", back_populates="expense")
    audit_logs = relationship("AuditLog", back_populates="expense")
    
    def __repr__(self):
        return f"<Expense(id={self.id}, amount={self.amount}, status='{self.status}')>"
