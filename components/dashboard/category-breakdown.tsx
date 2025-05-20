"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/lib/types/expense"
import type { Category } from "@/lib/types/category"
import type { CategoryBudget } from "@/lib/types/category-budget"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface CategoryBreakdownProps {
  expenses: Expense[]
  categories: Category[]
  budgets: CategoryBudget[]
}

interface CategorySummary {
  id: string
  name: string
  spent: number
  budget: number
  percentage: number
}

export function CategoryBreakdown({ expenses, categories, budgets }: CategoryBreakdownProps) {
  // Calculate spending by category
  const categorySummaries: CategorySummary[] = categories.map((category) => {
    const categoryExpenses = expenses.filter((expense) => expense.categoryId === category.id)
    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const categoryBudget = budgets.find((budget) => budget.categoryId === category.id)
    const budgetAmount = categoryBudget ? categoryBudget.amount : 0

    const percentage = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0

    return {
      id: category.id,
      name: category.name,
      spent: totalSpent,
      budget: budgetAmount,
      percentage: Math.min(percentage, 100), // Cap at 100% for display purposes
    }
  })

  // Sort by percentage of budget used (descending)
  const sortedSummaries = [...categorySummaries].sort((a, b) => b.percentage - a.percentage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Your spending by category compared to budgets</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedSummaries.length > 0 ? (
          <div className="space-y-8">
            {sortedSummaries.map((summary) => (
              <div key={summary.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{summary.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(summary.spent)}
                      {summary.budget > 0 && ` / ${formatCurrency(summary.budget)}`}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{summary.percentage.toFixed(0)}%</span>
                </div>
                <Progress value={summary.percentage} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No categories available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
