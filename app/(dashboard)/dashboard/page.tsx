"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { getUserExpenses } from "@/lib/api/expenses"
import { getUserCategories } from "@/lib/api/categories"
import { getUserCategoryBudgets } from "@/lib/api/category-budgets"
import { getUserById } from "@/lib/api/users"
import type { Expense } from "@/lib/types/expense"
import type { Category } from "@/lib/types/category"
import type { CategoryBudget } from "@/lib/types/category-budget"
import type { User } from "@/lib/types/user"

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [budgets, setBudgets] = useState<CategoryBudget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalBudget, setTotalBudget] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) return

        const [expensesData, categoriesData, budgetsData, userData] = await Promise.all([
          getUserExpenses(userId),
          getUserCategories(),
          getUserCategoryBudgets(Number(userId)),
          getUserById(userId),
        ])

        const sortedExpenses = [...expensesData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setExpenses(sortedExpenses)
        setCategories(categoriesData)
        setBudgets(budgetsData)

        const spent = expensesData.reduce((sum, expense) => sum + (expense.amount ?? 0), 0)
        const budget = userData?.overAllBudget ?? 0

        setTotalSpent(spent)
        setTotalBudget(budget)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Llogaritja e shpenzimit më të madh
  const largestExpense = expenses.length > 0
    ? expenses.reduce((max, expense) => (expense.amount && expense.amount > max ? expense.amount : max), 0)
    : 0

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} total transactions</p>
          </CardContent>
        </Card>

        {/* Karta Largest Expense në vend të Total Budget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M9 21H7a4 4 0 0 1-4-4v-2" />
              <circle cx="12" cy="7" r="4" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${largestExpense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Highest single expense</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">${((totalBudget || 0) - totalSpent).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Expense categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview expenses={expenses} categories={categories} />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <CategoryBreakdown categories={categories} expenses={expenses} budgets={budgets} />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentExpenses expenses={expenses} categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
