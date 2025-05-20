export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  categoryId: string
  userId: string
  createdAt?: string
  updatedAt?: string
}
