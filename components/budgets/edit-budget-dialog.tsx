"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CategoryBudget } from "@/lib/types/category-budget"
import type { Category } from "@/lib/types/category"
import { updateCategoryBudget } from "@/lib/api/category-budgets"
import { useToast } from "@/hooks/use-toast"

interface EditBudgetDialogProps {
  budget: CategoryBudget
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (budget: CategoryBudget) => void
}

export function EditBudgetDialog({ budget, categories, open, onOpenChange, onUpdate }: EditBudgetDialogProps) {
  const [budgetValue, setBudgetValue] = useState(budget.budget.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const category = categories.find((cat) => cat.id === budget.categoryId)

  useEffect(() => {
    if (open) {
      setBudgetValue(budget.budget.toString())
    }
  }, [budget, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!budgetValue) {
      toast({
        title: "Missing budget",
        description: "Please provide a budget amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Send only budget as per backend contract
      const updatedBudget = await updateCategoryBudget(budget.id.toString(), {
        budget: Number.parseFloat(budgetValue),
      })

      onUpdate(updatedBudget)
      onOpenChange(false)

      toast({
        title: "Budget updated",
        description: "Your budget has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>Update the budget for {category?.name || "this category"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category?.name || "Unknown Category"} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget Amount</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
