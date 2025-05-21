"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseFilters } from "@/components/expenses/expense-filters"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { getUserExpenses } from "@/lib/api/expenses"
import { getUserCategories } from "@/lib/api/categories"
import type { Expense } from "@/lib/types/expense"
import type { Category } from "@/lib/types/category"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) return

        const [expensesData, categoriesData] = await Promise.all([getUserExpenses(userId), getUserCategories()])

        setExpenses(expensesData)
        setFilteredExpenses(expensesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching expenses data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...expenses]

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter((expense) => expense.categoryId === Number(selectedCategoryId))
    }

    // Filter by date range
    if (dateRange?.from) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= dateRange.from!
      })
    }

    if (dateRange?.to) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate <= dateRange.to!
      })
    }

    setFilteredExpenses(filtered)
  }, [expenses, selectedCategoryId, dateRange])

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev])
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <ExpenseFilters
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <ExpenseList
        expenses={filteredExpenses}
        categories={categories}
        isLoading={isLoading}
        onDelete={handleDeleteExpense}
        onUpdate={handleUpdateExpense}
      />

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        categories={categories}
        onAddExpense={handleAddExpense}
      />
    </div>
  )
}
