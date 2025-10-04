from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_active_user
from app.services.ocr_service import OCRService
from app.schemas.receipt import ReceiptResponse, ReceiptWithOCR
import os
from app.core.config import settings

router = APIRouter()

@router.post("/extract", response_model=ReceiptWithOCR)
async def extract_receipt_data(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Extract data from receipt using OCR."""
    # Validate file type
    if file.content_type not in settings.allowed_file_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not supported"
        )
    
    # Validate file size
    if file.size > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large"
        )
    
    # Save file
    os.makedirs(settings.upload_directory, exist_ok=True)
    file_path = os.path.join(settings.upload_directory, file.filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Process with OCR
    ocr_service = OCRService()
    extracted_data = await ocr_service.extract_receipt_data(file_path)
    
    return {
        "filename": file.filename,
        "file_path": file_path,
        "file_size": file.size,
        "mime_type": file.content_type,
        "ocr_extracted_data": extracted_data
    }

@router.post("/process-receipt")
async def process_receipt(
    file: UploadFile = File(...),
    expense_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Process receipt and create expense entry."""
    # Validate file
    if file.content_type not in settings.allowed_file_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not supported"
        )
    
    if file.size > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large"
        )
    
    # Save file
    os.makedirs(settings.upload_directory, exist_ok=True)
    file_path = os.path.join(settings.upload_directory, file.filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Process with OCR
    ocr_service = OCRService()
    extracted_data = await ocr_service.extract_receipt_data(file_path)
    
    # Create receipt record
    from app.models.receipt import Receipt
    receipt = Receipt(
        filename=file.filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=file.size,
        mime_type=file.content_type,
        is_processed=True,
        ocr_text=extracted_data.get("text", ""),
        ocr_confidence=extracted_data.get("confidence", ""),
        extracted_amount=extracted_data.get("amount", ""),
        extracted_currency=extracted_data.get("currency", ""),
        extracted_date=extracted_data.get("date"),
        extracted_merchant=extracted_data.get("merchant", ""),
        extracted_category=extracted_data.get("category", ""),
        expense_id=expense_id
    )
    
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    
    return {
        "receipt_id": receipt.id,
        "extracted_data": extracted_data,
        "message": "Receipt processed successfully"
    }

