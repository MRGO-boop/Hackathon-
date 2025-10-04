import { useState } from "react";
import { Search, Filter, Trash2, Edit, Calendar, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Business",
  "Other"
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Food & Dining": "bg-orange-100 text-orange-800",
    "Transportation": "bg-blue-100 text-blue-800",
    "Shopping": "bg-purple-100 text-purple-800",
    "Entertainment": "bg-pink-100 text-pink-800",
    "Bills & Utilities": "bg-red-100 text-red-800",
    "Healthcare": "bg-green-100 text-green-800",
    "Travel": "bg-cyan-100 text-cyan-800",
    "Education": "bg-indigo-100 text-indigo-800",
    "Business": "bg-gray-100 text-gray-800",
    "Other": "bg-yellow-100 text-yellow-800"
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date");

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || expense.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amount - a.amount;
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        default: // date
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Expenses</h2>
          <p className="text-gray-600 mb-4">Manage and track all your expenses in one place.</p>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{filteredExpenses.length}</div>
              <div className="text-sm text-gray-600">Expenses</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">${totalAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="category">Sort by Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>
            {filteredExpenses.length} of {expenses.length} expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length > 0 ? (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                        <Badge className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                      </div>
                      
                      {expense.description && (
                        <p className="text-sm text-gray-600 mb-2">{expense.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-red-600">${expense.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No expenses found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}