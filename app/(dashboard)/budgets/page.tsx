"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BudgetList } from "@/components/budgets/budget-list"
import { AddBudgetDialog } from "@/components/budgets/add-budget-dialog"
import { getUserCategoryBudgets } from "@/lib/api/category-budgets"
import { getUserCategories } from "@/lib/api/categories"
import type { CategoryBudget } from "@/lib/types/category-budget"
import type { Category } from "@/lib/types/category"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) return

        const [budgetsData, categoriesData] = await Promise.all([getUserCategoryBudgets(userId), getUserCategories()])

        setBudgets(budgetsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching budgets data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddBudget = (newBudget: CategoryBudget) => {
    setBudgets((prev) => [...prev, newBudget])
  }

  const handleDeleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }

  const handleUpdateBudget = (updatedBudget: CategoryBudget) => {
    setBudgets((prev) => prev.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
        <Button onClick={() => setIsAddBudgetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <BudgetList
        budgets={budgets}
        categories={categories}
        isLoading={isLoading}
        onDelete={handleDeleteBudget}
        onUpdate={handleUpdateBudget}
      />

      <AddBudgetDialog
        open={isAddBudgetOpen}
        onOpenChange={setIsAddBudgetOpen}
        categories={categories}
        existingBudgets={budgets}
        onAddBudget={handleAddBudget}
      />
    </div>
  )
}
