import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { motion } from "motion/react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface DashboardProps {
  expenses: Expense[];
}

export function Dashboard({ expenses }: DashboardProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative z-10">
          <motion.h2 
            className="text-2xl font-semibold text-gray-900 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome to FinXpense
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Track your expenses with ease and gain insights into your spending habits.
          </motion.p>
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl font-bold text-primary">${totalExpenses.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </motion.div>
            <div className="w-px h-12 bg-gray-300"></div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl font-bold text-green-600">${thisMonthTotal.toFixed(2)}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 opacity-10"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DollarSign className="w-full h-full text-primary" />
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Expenses", value: `${totalExpenses.toFixed(2)}`, subtitle: `${expenses.length} transactions`, icon: DollarSign, color: "text-blue-600" },
          { title: "This Month", value: `${thisMonthTotal.toFixed(2)}`, subtitle: `${thisMonthExpenses.length} transactions`, icon: TrendingUp, color: "text-green-600" },
          { title: "Average Expense", value: `${avgExpense.toFixed(2)}`, subtitle: "Per transaction", icon: TrendingDown, color: "text-purple-600" },
          { title: "Top Category", value: topCategory ? `${topCategory[1].toFixed(2)}` : '$0.00', subtitle: topCategory ? topCategory[0] : 'No data', icon: ShoppingCart, color: "text-orange-600" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`h-4 w-4 ${stat.color} group-hover:${stat.color}`} />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-2xl font-bold"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest spending activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expense, index) => (
                  <motion.div 
                    key={expense.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/80 transition-all duration-200 cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {expense.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.div 
                      className="text-lg font-semibold text-red-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      -${expense.amount.toFixed(2)}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-8 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                </motion.div>
                <p>No expenses yet. Add your first expense to get started!</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}