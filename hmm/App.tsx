import { useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { AddExpense } from "./components/AddExpense";
import { ExpenseList } from "./components/ExpenseList";
import { Analytics } from "./components/Analytics";
import { AuthPage } from "./components/AuthPage";
import { InteractiveBackground } from "./components/InteractiveBackground";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Coffee at Starbucks',
      amount: 5.50,
      category: 'Food & Dining',
      date: '2024-12-01',
      description: 'Morning coffee'
    },
    {
      id: '2',
      title: 'Gas Station',
      amount: 45.00,
      category: 'Transportation',
      date: '2024-12-02',
      description: 'Weekly fuel'
    },
    {
      id: '3',
      title: 'Grocery Shopping',
      amount: 120.75,
      category: 'Shopping',
      date: '2024-12-03',
      description: 'Weekly groceries at Whole Foods'
    },
    {
      id: '4',
      title: 'Movie Tickets',
      amount: 24.00,
      category: 'Entertainment',
      date: '2024-12-04',
      description: 'Date night at cinema'
    },
    {
      id: '5',
      title: 'Electric Bill',
      amount: 89.50,
      category: 'Bills & Utilities',
      date: '2024-12-05',
      description: 'Monthly electricity payment'
    }
  ]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prev => [...prev, newExpense]);
    setActiveTab('expenses'); // Navigate to expenses list after adding
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    // Reset expenses to default for demo purposes
    setExpenses([
      {
        id: '1',
        title: 'Coffee at Starbucks',
        amount: 5.50,
        category: 'Food & Dining',
        date: '2024-12-01',
        description: 'Morning coffee'
      },
      {
        id: '2',
        title: 'Gas Station',
        amount: 45.00,
        category: 'Transportation',
        date: '2024-12-02',
        description: 'Weekly fuel'
      },
      {
        id: '3',
        title: 'Grocery Shopping',
        amount: 120.75,
        category: 'Shopping',
        date: '2024-12-03',
        description: 'Weekly groceries at Whole Foods'
      },
      {
        id: '4',
        title: 'Movie Tickets',
        amount: 24.00,
        category: 'Entertainment',
        date: '2024-12-04',
        description: 'Date night at cinema'
      },
      {
        id: '5',
        title: 'Electric Bill',
        amount: 89.50,
        category: 'Bills & Utilities',
        date: '2024-12-05',
        description: 'Monthly electricity payment'
      }
    ]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard expenses={expenses} />;
      case 'add':
        return <AddExpense onAddExpense={addExpense} />;
      case 'expenses':
        return <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />;
      case 'analytics':
        return <Analytics expenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} />;
    }
  };

  // Show authentication page if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen">
        <InteractiveBackground variant="auth" />
        <div className="relative z-10">
          <AuthPage onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <InteractiveBackground variant="app" />
      
      <div className="relative z-10">
        <Header 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}