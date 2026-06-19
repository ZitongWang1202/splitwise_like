import { Link, useLocation } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {

  const { token, logout } = useAuth()
  const location = useLocation()

  return (
    <nav
      className="
        border-b
        px-6
        py-4
        flex
        justify-between
      "
    >
      <Link to="/">
        Splitwise
      </Link>

      {location.pathname === "/login" && (
        <Link to="/register">
          Register
        </Link>
      )}

      {location.pathname === "/register" && (
        <Link to="/login">
          Login
        </Link>
      )}

      {token && (
        <button onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  )
}
