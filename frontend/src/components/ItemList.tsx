import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function ItemList({ children }: Props) {
  return (
    <div className="space-y-1">
      {children}
    </div>
  )
}
