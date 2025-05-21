import type { Category } from "../types/category"

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`


export async function createCategory(categoryData: Omit<Category, "id"> & { userId: number }): Promise<Category> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to create category")
  }

  return response.json()
}



export async function getUserCategories(): Promise<Category[]> {
  const userIdStr = localStorage.getItem("userId")
  const userId = userIdStr ? parseInt(userIdStr, 10) : null

  if (!userId) {
    throw new Error("User ID not found in localStorage")
  }

  const response = await fetch(`${API_URL}/user/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}


export async function getCategoryById(id: number): Promise<Category> {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch category")
  }

  return response.json()
}


export async function updateCategory(id: number, categoryData: Omit<Category, "id">): Promise<Category> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    throw new Error("Failed to update category")
  }

  return response.json()
}


export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete category")
  }
}
