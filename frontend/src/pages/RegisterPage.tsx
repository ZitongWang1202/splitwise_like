import { useState } from "react"
import apiClient from "../api/client"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleRegister() {
    await apiClient.post("/auth/register", {
      email,
      password,
    })

    navigate("/login")
  }

  return (
    <div>
      <h1>Register</h1>

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

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  )
}