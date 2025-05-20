"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/lib/types/expense"
import type { Category } from "@/lib/types/category"
import { formatDate, formatCurrency } from "@/lib/utils"

interface RecentExpensesProps {
  expenses: Expense[]
  categories: Category[]
}

export function RecentExpenses({ expenses, categories }: RecentExpensesProps) {
  // Get the 10 most recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  // Function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your 10 most recent expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {recentExpenses.length > 0 ? (
          <div className="space-y-8">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryName(expense.categoryId)} • {formatDate(expense.date)}
                  </p>
                </div>
                <div className="ml-auto font-medium">{formatCurrency(expense.amount)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No expenses recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
