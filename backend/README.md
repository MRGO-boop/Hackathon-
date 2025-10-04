# Expense Management System - Backend API

A comprehensive backend API for expense management system with multi-level approval workflows, OCR receipt processing, and currency conversion.

## Features

- **User Management**: Admin, Manager, and Employee roles with hierarchical relationships
- **Expense Submission**: Multi-currency expense submission with receipt upload
- **OCR Processing**: Automatic receipt data extraction using Tesseract
- **Approval Workflows**: Configurable multi-level approval rules (sequential, parallel, percentage-based)
- **Currency Conversion**: Real-time currency conversion using external APIs
- **Audit Logging**: Complete audit trail for all actions
- **Authentication**: JWT-based authentication with role-based access control

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Primary database
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations
- **Tesseract**: OCR engine for receipt processing
- **JWT**: JSON Web Tokens for authentication

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Set up database**
   ```bash
   # Install PostgreSQL and create database
   createdb expense_management
   
   # Run migrations
   alembic upgrade head
   ```

6. **Install Tesseract (for OCR)**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install tesseract-ocr
   
   # macOS
   brew install tesseract
   
   # Windows
   # Download from: https://github.com/UB-Mannheim/tesseract/wiki
   ```

## Running the Application

```bash
# Development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users/` - Get all users (admin)
- `GET /api/users/company` - Get company users
- `GET /api/users/{user_id}` - Get user by ID
- `POST /api/users/` - Create user (admin)
- `PUT /api/users/{user_id}` - Update user (admin)
- `DELETE /api/users/{user_id}` - Delete user (admin)

### Companies
- `GET /api/companies/` - Get all companies (admin)
- `GET /api/companies/{company_id}` - Get company by ID
- `POST /api/companies/` - Create company (admin)
- `PUT /api/companies/{company_id}` - Update company (admin)

### Expenses
- `GET /api/expenses/` - Get user expenses
- `GET /api/expenses/company` - Get company expenses (managers)
- `GET /api/expenses/pending-approvals` - Get pending approvals
- `GET /api/expenses/{expense_id}` - Get expense by ID
- `POST /api/expenses/` - Create expense
- `PUT /api/expenses/{expense_id}` - Update expense
- `POST /api/expenses/{expense_id}/submit` - Submit expense for approval

### Approvals
- `GET /api/approvals/pending` - Get pending approvals
- `POST /api/approvals/{approval_id}/approve` - Approve expense
- `POST /api/approvals/{approval_id}/reject` - Reject expense
- `GET /api/approvals/rules/` - Get approval rules
- `POST /api/approvals/rules/` - Create approval rule
- `PUT /api/approvals/rules/{rule_id}` - Update approval rule

### OCR
- `POST /api/ocr/extract` - Extract receipt data using OCR
- `POST /api/ocr/process-receipt` - Process receipt and create expense

### Currency
- `GET /api/currency/rates` - Get exchange rates
- `GET /api/currency/convert` - Convert currency
- `GET /api/currency/currencies` - Get supported currencies
- `GET /api/currency/countries` - Get countries with currencies

## Database Schema

### Core Tables
- **users**: User accounts with roles and relationships
- **companies**: Company information with default currency
- **expenses**: Expense records with multi-currency support
- **expense_categories**: Categorization of expenses
- **receipts**: Receipt files with OCR data
- **approval_rules**: Configurable approval workflows
- **approvals**: Individual approval decisions
- **approval_workflows**: Workflow state management
- **audit_logs**: Complete audit trail

### Key Relationships
- Users belong to companies
- Users have reporting managers (hierarchical)
- Expenses belong to users and companies
- Approvals follow configurable rules
- All actions are logged in audit_logs

## Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `TESSERACT_PATH`: Path to Tesseract executable
- `CURRENCY_API_KEY`: API key for currency conversion
- `UPLOAD_DIRECTORY`: Directory for file uploads

## Development

### Running Tests
```bash
pytest
```

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Code Quality
```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

## Deployment

### Docker
```bash
# Build image
docker build -t expense-management-api .

# Run container
docker run -p 8000:8000 expense-management-api
```

### Production Considerations
- Use environment variables for all configuration
- Set up proper database connection pooling
- Configure CORS for your frontend domain
- Set up logging and monitoring
- Use HTTPS in production
- Configure file storage (AWS S3, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

