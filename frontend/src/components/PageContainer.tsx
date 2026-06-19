import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function PageContainer({
  children,
}: Props) {
  return (
    <div
      className="
        max-w-4xl
        mx-auto
        p-8
        min-w-0
      "
    >
      {children}
    </div>
  )
}
