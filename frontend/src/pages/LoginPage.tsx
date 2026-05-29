import { useState } from "react"
import apiClient from "../api/client"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin() {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    })

    const token = response.data.access_token

    login(token)

    navigate("/")
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}