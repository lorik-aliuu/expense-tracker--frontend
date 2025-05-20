import type { Expense } from "../types/expense"
import { mockExpenses, generateId } from "./mock-data"

const API_URL = "/api/Expense"

// Flag to use mock data instead of real API calls
const USE_MOCK_DATA = true

export async function createExpense(
  userId: string,
  categoryId: string,
  expenseData: Partial<Expense>,
): Promise<Expense> {
  if (USE_MOCK_DATA) {
    const newExpense: Expense = {
      id: generateId("exp"),
      description: expenseData.description || "",
      amount: expenseData.amount || 0,
      date: expenseData.date || new Date().toISOString(),
      categoryId: categoryId,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockExpenses.push(newExpense)
    return Promise.resolve({ ...newExpense })
  }

  const response = await fetch(`${API_URL}/${userId}/${categoryId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(expenseData),
  })

  if (!response.ok) {
    throw new Error("Failed to create expense")
  }

  return response.json()
}

export async function getUserExpenses(userId: string): Promise<Expense[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockExpenses.filter((e) => e.userId === userId))
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch expenses")
  }

  return response.json()
}

export async function getExpenseById(id: string): Promise<Expense> {
  if (USE_MOCK_DATA) {
    const expense = mockExpenses.find((e) => e.id === id)
    if (!expense) {
      throw new Error("Expense not found")
    }

    return Promise.resolve({ ...expense })
  }

  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch expense")
  }

  return response.json()
}

export async function updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense> {
  if (USE_MOCK_DATA) {
    const expenseIndex = mockExpenses.findIndex((e) => e.id === id)
    if (expenseIndex === -1) {
      throw new Error("Expense not found")
    }

    mockExpenses[expenseIndex] = {
      ...mockExpenses[expenseIndex],
      ...expenseData,
      updatedAt: new Date().toISOString(),
    }

    return Promise.resolve({ ...mockExpenses[expenseIndex] })
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(expenseData),
  })

  if (!response.ok) {
    throw new Error("Failed to update expense")
  }

  return response.json()
}

export async function deleteExpense(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const expenseIndex = mockExpenses.findIndex((e) => e.id === id)
    if (expenseIndex === -1) {
      throw new Error("Expense not found")
    }

    mockExpenses.splice(expenseIndex, 1)
    return Promise.resolve()
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete expense")
  }
}
