export interface Expense {
  id: number 
  description: string | null
  amount: number | null
  date: string
categoryId: number | null
}
