#!/usr/bin/env python3
"""
Script to create initial data for the expense management system.
Run this once to set up a default company and admin user.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.company import Company
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def create_initial_data():
    """Create initial company and admin user."""
    db = SessionLocal()
    
    try:
        # Check if company already exists
        existing_company = db.query(Company).first()
        if existing_company:
            print(f"Company already exists: {existing_company.name} (ID: {existing_company.id})")
            company = existing_company
        else:
            # Create default company
            company = Company(
                name="Default Company",
                country="USA",
                default_currency="USD"
            )
            db.add(company)
            db.commit()
            db.refresh(company)
            print(f"Created company: {company.name} (ID: {company.id})")
        
        # Check if admin user already exists
        existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if existing_admin:
            print(f"Admin user already exists: {existing_admin.email}")
        else:
            # Create default admin user
            admin_user = User(
                email="admin@company.com",
                hashed_password=get_password_hash("admin123"[:72]),  # Truncate password for bcrypt
                first_name="Admin",
                last_name="User",
                role=UserRole.ADMIN,
                company_id=company.id,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Created admin user: {admin_user.email} (password: admin123)")
        
        print("\n✅ Initial data setup complete!")
        print(f"Company ID: {company.id}")
        print("You can now register users with this company_id")
        
    except Exception as e:
        print(f"Error creating initial data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_data()