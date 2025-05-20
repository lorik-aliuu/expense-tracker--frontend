import type { CategoryBudget } from "../types/category-budget"
import { mockCategoryBudgets, generateId } from "./mock-data"

const API_URL = "/api/CategoryBudget"

// Flag to use mock data instead of real API calls
const USE_MOCK_DATA = true

export async function createCategoryBudget(budgetData: Partial<CategoryBudget>): Promise<CategoryBudget> {
  if (USE_MOCK_DATA) {
    const newBudget: CategoryBudget = {
      id: generateId("budget"),
      categoryId: budgetData.categoryId || "",
      userId: budgetData.userId || "",
      amount: budgetData.amount || 0,
      spent: budgetData.spent || 0,
      period: budgetData.period || "Monthly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCategoryBudgets.push(newBudget)
    return Promise.resolve({ ...newBudget })
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(budgetData),
  })

  if (!response.ok) {
    throw new Error("Failed to create budget")
  }

  return response.json()
}

export async function getUserCategoryBudgets(userId: string): Promise<CategoryBudget[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockCategoryBudgets.filter((b) => b.userId === userId))
  }

  const response = await fetch(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch budgets")
  }

  return response.json()
}

export async function getCategoryBudgetById(id: string): Promise<CategoryBudget> {
  if (USE_MOCK_DATA) {
    const budget = mockCategoryBudgets.find((b) => b.id === id)
    if (!budget) {
      throw new Error("Budget not found")
    }

    return Promise.resolve({ ...budget })
  }

  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch budget")
  }

  return response.json()
}

export async function updateCategoryBudget(id: string, budgetData: Partial<CategoryBudget>): Promise<CategoryBudget> {
  if (USE_MOCK_DATA) {
    const budgetIndex = mockCategoryBudgets.findIndex((b) => b.id === id)
    if (budgetIndex === -1) {
      throw new Error("Budget not found")
    }

    mockCategoryBudgets[budgetIndex] = {
      ...mockCategoryBudgets[budgetIndex],
      ...budgetData,
      updatedAt: new Date().toISOString(),
    }

    return Promise.resolve({ ...mockCategoryBudgets[budgetIndex] })
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(budgetData),
  })

  if (!response.ok) {
    throw new Error("Failed to update budget")
  }

  return response.json()
}

export async function deleteCategoryBudget(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const budgetIndex = mockCategoryBudgets.findIndex((b) => b.id === id)
    if (budgetIndex === -1) {
      throw new Error("Budget not found")
    }

    mockCategoryBudgets.splice(budgetIndex, 1)
    return Promise.resolve()
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete budget")
  }
}
