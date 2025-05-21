"use client"

import React, { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import type { Category } from "@/lib/types/category"
import { createCategory } from "@/lib/api/categories"
import { useToast } from "@/hooks/use-toast"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCategory: (category: Category) => void
}

export function AddCategoryDialog({ open, onOpenChange, onAddCategory }: AddCategoryDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setName("")
    setDescription("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "Missing name",
        description: "Please provide a category name",
        variant: "destructive",
      })
      return
    }

    const userIdStr = localStorage.getItem("userId")
    const userId = userIdStr ? parseInt(userIdStr, 10) : null

    if (!userId) {
      toast({
        title: "User not logged in",
        description: "Please log in to add a category",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newCategory = await createCategory({
        name,
        description,
        userId,
      })

      onAddCategory(newCategory)
      resetForm()
      onOpenChange(false)

      toast({
        title: "Category added",
        description: "Your category has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
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
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new category for organizing your expenses</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Groceries" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of this category"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
