# Expense Management System - Frontend

A sophisticated, modern frontend for the Expense Management System built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern React 18** with TypeScript for type safety
- **Sophisticated UI/UX** with Framer Motion animations
- **Real-time Backend Integration** with your FastAPI backend
- **JWT Authentication** with secure token management
- **Role-based Access Control** (Admin, Manager, Employee)
- **Expense Management** with receipt upload and OCR
- **Approval Workflows** with real-time status updates
- **Multi-currency Support** with real-time conversion
- **Responsive Design** for all devices

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **Axios** for API communication
- **Radix UI** for accessible components
- **Lucide React** for beautiful icons

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=FinXpense
VITE_APP_VERSION=1.0.0
```

### Backend Integration

The frontend is designed to work seamlessly with your FastAPI backend:

- **Authentication**: JWT token-based authentication
- **API Endpoints**: All backend endpoints are integrated
- **Real-time Updates**: Automatic data synchronization
- **Error Handling**: Comprehensive error management

## 🎨 Design System

### Color Palette
- **Primary**: Professional blue (#3B82F6)
- **Secondary**: Success green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Components
- **Modern cards** with subtle shadows
- **Smooth animations** and transitions
- **Responsive grid** layouts
- **Accessible form** controls

## 📱 Pages & Features

### Authentication
- **Login/Register** with form validation
- **JWT token management**
- **Password reset** functionality
- **Demo account** for testing

### Dashboard
- **Expense overview** with statistics
- **Recent transactions** display
- **Category breakdown** charts
- **Real-time data** updates

### Expense Management
- **Add expenses** with receipt upload
- **OCR processing** for automatic data extraction
- **Multi-currency** support
- **Expense categorization**

### Approval Workflows
- **Manager dashboard** for approvals
- **Real-time status** updates
- **Approval/rejection** with comments
- **Workflow visualization**

## 🚀 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── figma/          # Custom components
├── lib/                # Utilities and API
├── store/              # State management
├── types/              # TypeScript types
└── styles/             # Global styles
```

## 🔗 Backend Integration

### API Endpoints Used

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Expenses**: `/api/expenses/*`
- **Approvals**: `/api/approvals/*`
- **OCR**: `/api/ocr/*`
- **Currency**: `/api/currency/*`

### State Management

- **Auth Store**: User authentication and profile
- **Expense Store**: Expense data and categories
- **UI Store**: Application state and preferences

## 🎯 Key Features

### 🔐 Authentication System
- Secure JWT token handling
- Role-based navigation
- Automatic token refresh
- Password reset functionality

### 💰 Expense Management
- Intuitive expense submission
- Receipt upload with drag-and-drop
- OCR integration for automatic data extraction
- Multi-currency support with real-time conversion

### ✅ Approval Workflows
- Manager dashboard for approvals
- Real-time status updates
- Approval/rejection with comments
- Workflow visualization

### 📊 Analytics & Insights
- Role-based dashboards
- Expense analytics and charts
- Approval status tracking
- Company-wide insights (for admins)

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Configuration

Make sure to set the correct API URL in your environment:

```env
VITE_API_URL=https://your-backend-api.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API integration
- Test with the demo account
- Contact the development team

---

**Built with ❤️ for modern expense management**

