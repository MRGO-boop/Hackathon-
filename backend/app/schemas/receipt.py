from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ReceiptBase(BaseModel):
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    mime_type: str

class ReceiptCreate(ReceiptBase):
    expense_id: int

class ReceiptResponse(ReceiptBase):
    id: int
    is_processed: bool
    ocr_text: Optional[str]
    ocr_confidence: Optional[str]
    extracted_amount: Optional[str]
    extracted_currency: Optional[str]
    extracted_date: Optional[datetime]
    extracted_merchant: Optional[str]
    extracted_category: Optional[str]
    expense_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReceiptWithOCR(ReceiptResponse):
    ocr_extracted_data: Optional[dict] = None

