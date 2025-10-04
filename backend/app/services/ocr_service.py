import pytesseract
from PIL import Image
import re
from datetime import datetime
from typing import Dict, Any, Optional
from app.core.config import settings

class OCRService:
    def __init__(self):
        if settings.tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = settings.tesseract_path
    
    async def extract_receipt_data(self, image_path: str) -> Dict[str, Any]:
        """Extract data from receipt image using OCR."""
        try:
            # Open and process image
            image = Image.open(image_path)
            
            # Extract text using OCR
            text = pytesseract.image_to_string(image)
            
            # Extract structured data
            extracted_data = {
                "text": text,
                "confidence": "high",  # Could be calculated from OCR confidence
                "amount": self._extract_amount(text),
                "currency": self._extract_currency(text),
                "date": self._extract_date(text),
                "merchant": self._extract_merchant(text),
                "category": self._extract_category(text)
            }
            
            return extracted_data
            
        except Exception as e:
            print(f"OCR processing error: {e}")
            return {
                "text": "",
                "confidence": "low",
                "amount": "",
                "currency": "",
                "date": None,
                "merchant": "",
                "category": ""
            }
    
    def _extract_amount(self, text: str) -> str:
        """Extract amount from OCR text."""
        # Look for currency patterns
        amount_patterns = [
            r'\$(\d+\.?\d*)',  # $123.45
            r'(\d+\.?\d*)\s*\$',  # 123.45 $
            r'(\d+\.?\d*)\s*(?:USD|EUR|GBP|INR)',  # 123.45 USD
            r'Total[:\s]*(\d+\.?\d*)',  # Total: 123.45
            r'Amount[:\s]*(\d+\.?\d*)',  # Amount: 123.45
        ]
        
        for pattern in amount_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        
        return ""
    
    def _extract_currency(self, text: str) -> str:
        """Extract currency from OCR text."""
        currency_patterns = [
            r'\$',  # Dollar sign
            r'USD',  # USD
            r'EUR',  # EUR
            r'GBP',  # GBP
            r'INR',  # INR
        ]
        
        for pattern in currency_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                if pattern == r'\$':
                    return "USD"
                return pattern
        
        return "USD"  # Default to USD
    
    def _extract_date(self, text: str) -> Optional[datetime]:
        """Extract date from OCR text."""
        date_patterns = [
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})',  # MM/DD/YYYY or DD/MM/YYYY
            r'(\d{4})[/-](\d{1,2})[/-](\d{1,2})',  # YYYY/MM/DD
            r'(\d{1,2})\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{2,4})',  # DD Mon YYYY
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    if len(match.groups()) == 3:
                        # Try different date formats
                        for fmt in ['%m/%d/%Y', '%d/%m/%Y', '%Y/%m/%d', '%d %b %Y']:
                            try:
                                date_str = '/'.join(match.groups())
                                return datetime.strptime(date_str, fmt)
                            except:
                                continue
                except:
                    continue
        
        return None
    
    def _extract_merchant(self, text: str) -> str:
        """Extract merchant name from OCR text."""
        # Look for common merchant indicators
        merchant_indicators = [
            r'Merchant[:\s]*([^\n]+)',
            r'Store[:\s]*([^\n]+)',
            r'Business[:\s]*([^\n]+)',
        ]
        
        for pattern in merchant_indicators:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # If no specific pattern, take first line as merchant
        lines = text.split('\n')
        if lines:
            return lines[0].strip()
        
        return ""
    
    def _extract_category(self, text: str) -> str:
        """Extract expense category from OCR text."""
        # Look for common expense categories
        category_keywords = {
            'food': ['restaurant', 'food', 'dining', 'cafe', 'coffee'],
            'travel': ['hotel', 'flight', 'taxi', 'uber', 'lyft', 'travel'],
            'office': ['office', 'supplies', 'stationery', 'equipment'],
            'transport': ['gas', 'fuel', 'parking', 'toll', 'transport'],
            'entertainment': ['movie', 'theater', 'entertainment', 'sports'],
            'utilities': ['electricity', 'water', 'internet', 'phone', 'utility']
        }
        
        text_lower = text.lower()
        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return category.title()
        
        return "Miscellaneous"

