import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function Card({
  children,
}: Props) {
  return (
    <div
      className="
        border
        rounded-xl
        p-4
        shadow-sm
      "
    >
      {children}
    </div>
  )
}