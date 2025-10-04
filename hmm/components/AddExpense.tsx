import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface AddExpenseProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const categories = [
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

export function AddExpense({ onAddExpense }: AddExpenseProps) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) {
      return;
    }

    onAddExpense({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description
    });

    // Reset form
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: ""
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add New Expense</h2>
          <p className="text-gray-600">Track your spending by adding a new expense entry.</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Receipt className="w-full h-full" />
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Fill in the information about your expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Expense Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Lunch at cafe"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Additional notes about this expense"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Add Suggestions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Add</CardTitle>
          <CardDescription>Common expense types for faster entry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: "Coffee", amount: 5.00, category: "Food & Dining" },
              { title: "Gas", amount: 50.00, category: "Transportation" },
              { title: "Lunch", amount: 15.00, category: "Food & Dining" },
              { title: "Parking", amount: 10.00, category: "Transportation" }
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  title: suggestion.title,
                  amount: suggestion.amount.toString(),
                  category: suggestion.category
                })}
                className="h-auto p-3 flex flex-col items-center space-y-1"
              >
                <span className="font-medium">{suggestion.title}</span>
                <span className="text-sm text-muted-foreground">${suggestion.amount}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}