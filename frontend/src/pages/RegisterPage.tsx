import { useState } from "react"
import { register as registerApi } from "../api/auth"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"

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

      <ErrorMessage message={error} />

      <Input
        disabled={loading}
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        disabled={loading}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        onClick={handleRegister}
        disabled={loading}
      >
        {
          loading
            ? "Registering..."
            : "Register"
        }
      </Button>
    </div>
  )
}
