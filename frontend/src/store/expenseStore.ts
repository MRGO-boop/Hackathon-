import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { expensesAPI, Expense, ExpenseCategory } from '../lib/api';

interface ExpenseState {
  expenses: Expense[];
  categories: ExpenseCategory[];
  activeTab: string;
  isLoading: boolean;
  error: string | null;
}

interface ExpenseActions {
  setActiveTab: (tab: string) => void;
  fetchExpenses: () => Promise<void>;
  fetchCompanyExpenses: () => Promise<void>;
  fetchExpenseCategories: () => Promise<void>;
  createExpense: (expenseData: {
    amount: number;
    currency: string;
    description: string;
    expense_date: string;
    category_id?: number;
  }) => Promise<void>;
  updateExpense: (id: number, expenseData: any) => Promise<void>;
  submitExpense: (id: number) => Promise<void>;
  deleteExpense: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState & ExpenseActions>()(
  persist(
    (set, get) => ({
      // State
      expenses: [],
      categories: [],
      activeTab: 'dashboard',
      isLoading: false,
      error: null,

      // Actions
      setActiveTab: (tab: string) => {
        set({ activeTab: tab });
      },

      fetchExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
          const expenses = await expensesAPI.getExpenses();
          set({ expenses, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch expenses',
            isLoading: false,
          });
        }
      },

      fetchCompanyExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
          const expenses = await expensesAPI.getCompanyExpenses();
          set({ expenses, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch company expenses',
            isLoading: false,
          });
        }
      },

      fetchExpenseCategories: async () => {
        try {
          const categories = await expensesAPI.getExpenseCategories();
          set({ categories });
        } catch (error: any) {
          console.error('Failed to fetch categories:', error);
        }
      },

      createExpense: async (expenseData) => {
        set({ isLoading: true, error: null });
        try {
          const newExpense = await expensesAPI.createExpense(expenseData);
          set((state) => ({
            expenses: [...state.expenses, newExpense],
            isLoading: false,
          }));
          // Navigate to expenses list after creating
          set({ activeTab: 'expenses' });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to create expense',
            isLoading: false,
          });
          throw error;
        }
      },

      updateExpense: async (id: number, expenseData: any) => {
        set({ isLoading: true, error: null });
        try {
          const updatedExpense = await expensesAPI.updateExpense(id, expenseData);
          set((state) => ({
            expenses: state.expenses.map(expense =>
              expense.id === id ? updatedExpense : expense
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to update expense',
            isLoading: false,
          });
          throw error;
        }
      },

      submitExpense: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await expensesAPI.submitExpense(id);
          // Refresh expenses to get updated status
          await get().fetchExpenses();
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Failed to submit expense',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteExpense: (id: number) => {
        set((state) => ({
          expenses: state.expenses.filter(expense => expense.id !== id)
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'expense-storage',
      partialize: (state) => ({
        activeTab: state.activeTab,
      }),
    }
  )
);

