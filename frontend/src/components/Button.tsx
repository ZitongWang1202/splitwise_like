import type { ReactNode } from "react"

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
}

export default function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        rounded-lg
        border
        px-4
        py-3
        font-medium
        disabled:opacity-50
      "
    >
      {children}
    </button>
  )
}