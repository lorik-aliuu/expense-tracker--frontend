"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CategoryList } from "@/components/categories/category-list"
import { AddCategoryDialog } from "@/components/categories/add-category-dialog"
import { getUserCategories } from "@/lib/api/categories"
import type { Category } from "@/lib/types/category"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getUserCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddCategory = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory])
  }

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <Button onClick={() => setIsAddCategoryOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onDelete={handleDeleteCategory}
        onUpdate={handleUpdateCategory}
      />

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onAddCategory={handleAddCategory}
      />
    </div>
  )
}
