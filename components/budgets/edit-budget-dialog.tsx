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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [amount, setAmount] = useState(budget.amount.toString())
  const [period, setPeriod] = useState(budget.period || "Monthly")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const category = categories.find((cat) => cat.id === budget.categoryId)

  useEffect(() => {
    if (open) {
      setAmount(budget.amount.toString())
      setPeriod(budget.period || "Monthly")
    }
  }, [budget, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) {
      toast({
        title: "Missing amount",
        description: "Please provide a budget amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updatedBudget = await updateCategoryBudget(budget.id, {
        ...budget,
        amount: Number.parseFloat(amount),
        period,
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
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
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
