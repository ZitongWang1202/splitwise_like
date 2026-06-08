import { useState } from "react"
import { register as registerApi } from "../api/auth"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const navigate = useNavigate()

  async function handleRegister() {

    try {

      setError("")
      setLoading(true)

      await registerApi(email, password)
      navigate("/login")

    } catch {

      setError("Registration failed")

    } finally {

      setLoading(false)

    }



  }

  return (
    <div>
      <h1>Register</h1>

      {
        error && (
          <p className="text-red-600">
            {error}
          </p>
        )
      }

      <input
        disabled={loading}
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        disabled={loading}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="
          border
          px-4
          py-2
          disabled:opacity-50
        "
        onClick={handleRegister}
        disabled={loading}
      >
        {
          loading
            ? "Registering..."
            : "Register"
        }
      </button>
    </div>
  )
}
