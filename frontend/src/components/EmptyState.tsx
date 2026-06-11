import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function EmptyState({ children }: Props) {
  return (
    <p className="text-gray-500">
      {children}
    </p>
  )
}
