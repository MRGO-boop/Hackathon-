import requests
from typing import Dict, Any
from decimal import Decimal
from app.core.config import settings

class CurrencyService:
    def __init__(self):
        self.api_url = settings.currency_api_url
        self.api_key = settings.currency_api_key
    
    async def get_exchange_rate(self, from_currency: str, to_currency: str) -> float:
        """Get exchange rate between two currencies."""
        try:
            if from_currency == to_currency:
                return 1.0
            
            # Use free API (no key required)
            url = f"https://api.exchangerate-api.com/v4/latest/{from_currency}"
            response = requests.get(url)
            response.raise_for_status()
            
            data = response.json()
            return data["rates"].get(to_currency, 1.0)
            
        except Exception as e:
            # Fallback to 1.0 if API fails
            print(f"Currency API error: {e}")
            return 1.0
    
    async def get_all_rates(self, base_currency: str = "USD") -> Dict[str, float]:
        """Get all exchange rates for a base currency."""
        try:
            url = f"https://api.exchangerate-api.com/v4/latest/{base_currency}"
            response = requests.get(url)
            response.raise_for_status()
            
            data = response.json()
            return data["rates"]
            
        except Exception as e:
            print(f"Currency API error: {e}")
            return {}
    
    async def convert_amount(self, amount: float, from_currency: str, to_currency: str) -> float:
        """Convert amount from one currency to another."""
        rate = await self.get_exchange_rate(from_currency, to_currency)
        return amount * rate
    
    async def get_currency_for_country(self, country: str) -> str:
        """Get default currency for a country."""
        country_currency_map = {
            "United States": "USD",
            "United Kingdom": "GBP",
            "European Union": "EUR", 
            "India": "INR",
            "Canada": "CAD",
            "Australia": "AUD",
            "Japan": "JPY",
            "Germany": "EUR",
            "France": "EUR",
            "Italy": "EUR",
            "Spain": "EUR"
        }
        return country_currency_map.get(country, "USD")

