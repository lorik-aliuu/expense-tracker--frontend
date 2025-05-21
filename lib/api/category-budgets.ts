import type { CategoryBudget } from "../types/category-budget"

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/CategoryBudget`

export async function createCategoryBudget(budgetData: Partial<CategoryBudget>): Promise<CategoryBudget> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budgetData),
  })

  if (!response.ok) {
    throw new Error("Failed to create budget")
  }

  return response.json()
}

export async function getUserCategoryBudgets(userId: number): Promise<CategoryBudget[]> {
  const response = await fetch(`${API_URL}/user/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch budgets")
  }

  return response.json()
}

export async function getCategoryBudgetById(id: string): Promise<CategoryBudget> {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch budget")
  }

  return response.json()
}

export async function updateCategoryBudget(
  id: string,
  budgetData: Partial<CategoryBudget>
): Promise<CategoryBudget> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budgetData),
  })

  if (!response.ok) {
    throw new Error("Failed to update budget")
  }

  return response.json()
}

export async function deleteCategoryBudget(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete budget")
  }
}
