import type { User } from "../types/user"
import type { Category } from "../types/category"
import type { Expense } from "../types/expense"
import type { CategoryBudget } from "../types/category-budget"
import { subDays } from "date-fns"

// Helper function to generate dates within the last 60 days
const getRandomRecentDate = () => {
  const today = new Date()
  const daysAgo = Math.floor(Math.random() * 60) // Random day within the last 60 days
  return subDays(today, daysAgo).toISOString()
}

// Mock user data
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
  },
]

// Mock categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Groceries",
    description: "Food and household items",
  },
  {
    id: "cat-2",
    name: "Transportation",
    description: "Gas, public transit, and car maintenance",
  },
  {
    id: "cat-3",
    name: "Entertainment",
    description: "Movies, games, and other fun activities",
  },
  {
    id: "cat-4",
    name: "Utilities",
    description: "Electricity, water, internet, etc.",
  },
  {
    id: "cat-5",
    name: "Dining Out",
    description: "Restaurants and takeout",
  },
]

// Generate more realistic dates for the mock expenses
const today = new Date()
const generateDailyExpenses = () => {
  const expenses: Expense[] = []

  // Generate expenses for the last 60 days
  for (let i = 0; i < 60; i++) {
    const date = subDays(today, i)

    // Add 1-3 expenses per day with some randomness
    const numExpenses = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < numExpenses; j++) {
      const categoryId = `cat-${Math.floor(Math.random() * 5) + 1}`
      const amount = Math.round(Math.random() * 100 * 100) / 100 // Random amount up to $100 with 2 decimal places

      expenses.push({
        id: `exp-${expenses.length + 1}`,
        description: getExpenseDescription(categoryId),
        amount,
        date: date.toISOString(),
        categoryId,
        userId: "user-1",
      })
    }
  }

  return expenses
}

// Helper to get a realistic description based on category
const getExpenseDescription = (categoryId: string) => {
  const descriptions: Record<string, string[]> = {
    "cat-1": ["Grocery shopping", "Supermarket", "Convenience store", "Farmers market", "Bulk food purchase"],
    "cat-2": ["Gas station", "Bus ticket", "Uber ride", "Train fare", "Car maintenance", "Parking fee"],
    "cat-3": ["Movie tickets", "Concert", "Video game", "Streaming subscription", "Museum entry"],
    "cat-4": ["Electricity bill", "Water bill", "Internet bill", "Phone bill", "Gas bill"],
    "cat-5": ["Restaurant dinner", "Coffee shop", "Fast food", "Food delivery", "Lunch with colleagues"],
  }

  const options = descriptions[categoryId] || ["Miscellaneous expense"]
  return options[Math.floor(Math.random() * options.length)]
}

// Mock expenses with better date distribution
export const mockExpenses: Expense[] = generateDailyExpenses()

// Mock category budgets
export const mockCategoryBudgets: CategoryBudget[] = [
  {
    id: "budget-1",
    categoryId: "cat-1",
    userId: "user-1",
    amount: 400,
    spent: 98.1,
    period: "Monthly",
  },
  {
    id: "budget-2",
    categoryId: "cat-2",
    userId: "user-1",
    amount: 200,
    spent: 69.95,
    period: "Monthly",
  },
  {
    id: "budget-3",
    categoryId: "cat-3",
    userId: "user-1",
    amount: 150,
    spent: 32.5,
    period: "Monthly",
  },
  {
    id: "budget-4",
    categoryId: "cat-4",
    userId: "user-1",
    amount: 300,
    spent: 175.39,
    period: "Monthly",
  },
  {
    id: "budget-5",
    categoryId: "cat-5",
    userId: "user-1",
    amount: 250,
    spent: 68.9,
    period: "Monthly",
  },
]

// Helper function to generate a random ID
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`
}
