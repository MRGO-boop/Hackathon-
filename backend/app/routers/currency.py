from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_active_user
from app.services.currency_service import CurrencyService
from typing import Dict, Any

router = APIRouter()

@router.get("/rates")
async def get_exchange_rates(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current exchange rates."""
    currency_service = CurrencyService()
    rates = await currency_service.get_all_rates()
    return rates

@router.get("/convert")
async def convert_currency(
    amount: float,
    from_currency: str,
    to_currency: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Convert currency amount."""
    currency_service = CurrencyService()
    converted_amount = await currency_service.convert_amount(amount, from_currency, to_currency)
    return {
        "original_amount": amount,
        "from_currency": from_currency,
        "to_currency": to_currency,
        "converted_amount": converted_amount
    }

@router.get("/currencies")
async def get_supported_currencies():
    """Get list of supported currencies."""
    from app.models.company import Currency
    return [currency.value for currency in Currency]

@router.get("/countries")
async def get_countries_with_currencies():
    """Get countries with their default currencies."""
    # This would typically come from a countries API or database
    countries = {
        "United States": "USD",
        "United Kingdom": "GBP", 
        "European Union": "EUR",
        "India": "INR",
        "Canada": "CAD",
        "Australia": "AUD",
        "Japan": "JPY"
    }
    return countries

