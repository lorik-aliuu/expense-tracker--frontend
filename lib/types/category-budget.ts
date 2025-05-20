export interface CategoryBudget {
  id: string
  categoryId: string
  userId: string
  amount: number
  spent?: number
  period?: string
  createdAt?: string
  updatedAt?: string
}
