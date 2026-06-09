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
        border
        px-4
        py-2
        rounded
        disabled:opacity-50
      "
    >
      {children}
    </button>
  )
}