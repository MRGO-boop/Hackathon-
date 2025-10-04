// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'employee';
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Company Types
export interface Company {
  id: number;
  name: string;
  country: string;
  default_currency: string;
  created_at: string;
  updated_at?: string;
}

// Expense Types
export interface Expense {
  id: number;
  amount: number;
  currency: string;
  amount_in_default_currency: number;
  exchange_rate: number;
  description: string;
  expense_date: string;
  status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'paid';
  submitter_id: number;
  company_id: number;
  category_id?: number;
  created_at: string;
  updated_at?: string;
  submitter?: User;
  company?: Company;
  category?: ExpenseCategory;
  approvals?: Approval[];
  receipts?: Receipt[];
}

export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
  company_id: number;
  is_active: boolean;
  created_at: string;
}

// Approval Types
export interface Approval {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approved_at?: string;
  expense_id: number;
  approver_id: number;
  workflow_id: number;
  created_at: string;
  updated_at?: string;
  approver?: User;
  expense?: Expense;
}

export interface ApprovalRule {
  id: number;
  name: string;
  description?: string;
  rule_type: 'sequential' | 'parallel' | 'percentage' | 'specific_approver' | 'hybrid';
  minimum_approval_percentage: number;
  requires_manager_approval: boolean;
  approver_sequence_matters: boolean;
  is_active: boolean;
  company_id: number;
  created_by_id: number;
  created_at: string;
  updated_at?: string;
  approvers?: ApprovalRuleApprover[];
}

export interface ApprovalRuleApprover {
  id: number;
  sequence_order: number;
  is_required: boolean;
  rule_id: number;
  approver_id: number;
  approver?: User;
}

// Receipt Types
export interface Receipt {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_processed: boolean;
  ocr_text?: string;
  ocr_confidence?: string;
  extracted_amount?: string;
  extracted_currency?: string;
  extracted_date?: string;
  extracted_merchant?: string;
  extracted_category?: string;
  expense_id: number;
  created_at: string;
}

// Currency Types
export interface CurrencyRate {
  [currency: string]: number;
}

export interface CurrencyConversion {
  original_amount: number;
  from_currency: string;
  to_currency: string;
  converted_amount: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'manager' | 'employee';
  company_id?: number;
}

export interface ExpenseForm {
  amount: number;
  currency: string;
  description: string;
  expense_date: string;
  category_id?: number;
}

export interface ApprovalForm {
  comments?: string;
}

// UI State Types
export interface TabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface LoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface ErrorState {
  error: string | null;
  setError: (error: string | null) => void;
}

// Dashboard Types
export interface DashboardStats {
  totalExpenses: number;
  thisMonthExpenses: number;
  averageExpense: number;
  topCategory: string;
  topCategoryAmount: number;
}

export interface ExpenseAnalytics {
  categoryBreakdown: { [category: string]: number };
  monthlyTrend: { [month: string]: number };
  statusBreakdown: { [status: string]: number };
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface OCRResult {
  text: string;
  confidence: string;
  amount?: string;
  currency?: string;
  date?: string;
  merchant?: string;
  category?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

