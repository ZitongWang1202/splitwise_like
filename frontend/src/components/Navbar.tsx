import { Link } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {

  const { logout } = useAuth()

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
        Splitwise Clone
      </Link>

      <button onClick={logout}>
        Logout
      </button>
    </nav>
  )
}