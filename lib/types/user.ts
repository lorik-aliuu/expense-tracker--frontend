export interface User {
  id: string
  name: string
  email: string
  overAllBudget: number
  password?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success:boolean
  userId: string
}
