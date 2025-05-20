import type { Category } from "../types/category"
import { mockCategories, generateId } from "./mock-data"

const API_URL = "/api/categories"

// Flag to use mock data instead of real API calls
const USE_MOCK_DATA = true

export async function createCategory(categoryData: Partial<Category>): Promise<Category> {
  if (USE_MOCK_DATA) {
    const newCategory: Category = {
      id: generateId("cat"),
      name: categoryData.name || "",
      description: categoryData.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCategories.push(newCategory)
    return Promise.resolve(newCategory)
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to create category")
  }

  return response.json()
}

export async function getUserCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve([...mockCategories])
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}

export async function getCategoryById(id: string): Promise<Category> {
  if (USE_MOCK_DATA) {
    const category = mockCategories.find((c) => c.id === id)
    if (!category) {
      throw new Error("Category not found")
    }

    return Promise.resolve({ ...category })
  }

  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch category")
  }

  return response.json()
}

export async function updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
  if (USE_MOCK_DATA) {
    const categoryIndex = mockCategories.findIndex((c) => c.id === id)
    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...categoryData,
      updatedAt: new Date().toISOString(),
    }

    return Promise.resolve({ ...mockCategories[categoryIndex] })
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to update category")
  }

  return response.json()
}

export async function deleteCategory(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const categoryIndex = mockCategories.findIndex((c) => c.id === id)
    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }

    mockCategories.splice(categoryIndex, 1)
    return Promise.resolve()
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete category")
  }
}
