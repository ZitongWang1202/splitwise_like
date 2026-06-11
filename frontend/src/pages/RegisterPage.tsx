import { useState } from "react"
import { register as registerApi } from "../api/auth"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Input from "../components/Input"
import ErrorMessage from "../components/ErrorMessage"
import PageContainer from "../components/PageContainer"
import PageTitle from "../components/PageTitle"
import FormStack from "../components/FormStack"

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
    <PageContainer>
      <PageTitle>Register</PageTitle>

      <FormStack>
        <ErrorMessage message={error} />

        <Input
          disabled={loading}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          disabled={loading}
          placeholder="Password"
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
      </FormStack>
    </PageContainer>
  )
}
