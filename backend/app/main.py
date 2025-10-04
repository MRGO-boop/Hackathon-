from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import uvicorn

from app.database import get_db, engine, Base
from app.routers import auth, users, expenses, approvals, companies, ocr, currency
from app.core.config import settings

# Create database tables (only if database is available)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not connect to database: {e}")
    print("Database tables will be created when database is available.")

app = FastAPI(
    title="Expense Management System API",
    description="Backend API for comprehensive expense management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(approvals.router, prefix="/api/approvals", tags=["Approvals"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR"])
app.include_router(currency.router, prefix="/api/currency", tags=["Currency"])

@app.get("/")
async def root():
    return {"message": "Expense Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
