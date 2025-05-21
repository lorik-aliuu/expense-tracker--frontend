"use client"

import type React from "react"
import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CategoryBudget } from "@/lib/types/category-budget"
import type { Category } from "@/lib/types/category"
import { createCategoryBudget } from "@/lib/api/category-budgets"
import { useToast } from "@/hooks/use-toast"

interface AddBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  existingBudgets: CategoryBudget[]
  onAddBudget: (budget: CategoryBudget) => void
}

export function AddBudgetDialog({
  open,
  onOpenChange,
  categories,
  existingBudgets,
  onAddBudget,
}: AddBudgetDialogProps) {
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Filter out categories that already have budgets
  const availableCategories = categories.filter(
    (category) => !existingBudgets.some((budget) => budget.categoryId === category.id),
  )

  const resetForm = () => {
    setCategoryId("")
    setAmount("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryId || !amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const userId = localStorage.getItem("userId")
      if (!userId || isNaN(Number(userId))) throw new Error("User ID is invalid")

      const newBudget = await createCategoryBudget({
        userId: Number(userId),
        categoryId: Number(categoryId),
        budget: parseFloat(amount), // property matches backend DTO
      })

      onAddBudget(newBudget)
      resetForm()
      onOpenChange(false)

      toast({
        title: "Budget added",
        description: "Your budget has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add budget",
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
            <DialogTitle>Add Budget</DialogTitle>
            <DialogDescription>Set a budget for a category to track your spending</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.length > 0 ? (
                    availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      All categories have budgets
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {availableCategories.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  All categories already have budgets. Create a new category first.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || availableCategories.length === 0}>
              {isSubmitting ? "Adding..." : "Add Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
