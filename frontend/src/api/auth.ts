import apiClient from "./client"

export async function login(email: string, password: string) {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  })

  return response.data
}

export async function register(email: string, password: string) {
  const response = await apiClient.post("/auth/register", {
    email,
    password,
  })

  return response.data
}