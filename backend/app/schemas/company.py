from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.company import Currency

class CompanyBase(BaseModel):
    name: str
    country: str
    default_currency: Currency

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    default_currency: Optional[Currency] = None

class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

