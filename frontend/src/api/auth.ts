import apiClient from "./client"

export async function login(email: string, password: string) {
  const body = new URLSearchParams()
  body.set("username", email)
  body.set("password", password)

  const response = await apiClient.post(
    "/auth/login", 
    body, 
    {
      headers: { 
        "Content-Type": 
          "application/x-www-form-urlencoded",
      },
    }
  )

  return response.data
}

export async function register(email: string, password: string) {
  const response = await apiClient.post(
    "/auth/register", 
    {
      email,
      password,
    },
  )

  return response.data
}