from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Receipt(Base):
    __tablename__ = "receipts"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    is_processed = Column(Boolean, default=False)
    ocr_text = Column(Text)
    ocr_confidence = Column(String)  # Store as string to preserve decimal precision
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # OCR extracted data
    extracted_amount = Column(String)  # Store as string to preserve decimal precision
    extracted_currency = Column(String(3))
    extracted_date = Column(DateTime)
    extracted_merchant = Column(String)
    extracted_category = Column(String)
    
    # Foreign keys
    expense_id = Column(Integer, ForeignKey("expenses.id"), nullable=False)
    
    # Relationships
    expense = relationship("Expense", back_populates="receipts")
    
    def __repr__(self):
        return f"<Receipt(id={self.id}, filename='{self.filename}', processed={self.is_processed})>"

