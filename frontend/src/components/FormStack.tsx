import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function FormStack({ children }: Props) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  )
}
