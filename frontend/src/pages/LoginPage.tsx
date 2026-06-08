import { useState } from "react"
import { login as loginApi } from "../api/auth"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin() {

    try {

      setError("")
      setLoading(true)

      const data = await loginApi(email, password)
      login(data.access_token)
      navigate("/")

    } catch {

      setError("Invalid email or password")

    } finally {

      setLoading(false)

    }



  }

  return (
    <div>
      <h1>Login</h1>

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
        onClick={handleLogin}
        disabled={loading}
      >
        {
          loading
            ? "Logging in..."
            : "Login"
        }
      </button>
    </div>
  )
}