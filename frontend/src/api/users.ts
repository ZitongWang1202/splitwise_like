import apiClient from "./client"

export async function getCurrentUser() {
  const response = await apiClient.get("/users/me")

  return response.data
}
