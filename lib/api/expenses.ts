import type { Expense } from "../types/expense"

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Expense`

export async function createExpense(
  userId: string,
  categoryId: string,
  expenseData: Partial<Expense>,
): Promise<Expense> {
  const response = await fetch(`${API_URL}/${userId}/${categoryId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  })

  if (!response.ok) {
    throw new Error("Failed to create expense")
  }

  return response.json()
}

// Modified this function to get userId from localStorage if not passed explicitly
export async function getUserExpenses(userId?: string): Promise<Expense[]> {
  const id = userId ?? localStorage.getItem("userId")

  if (!id) {
    throw new Error("User ID not found")
  }

  const response = await fetch(`${API_URL}/user/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch expenses")
  }

  return response.json()
}

export async function getExpenseById(id: string): Promise<Expense> {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch expense")
  }

  return response.json()
}

export async function updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  })

  if (!response.ok) {
    throw new Error("Failed to update expense")
  }

  return response.json()
}

export async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete expense")
  }
}
