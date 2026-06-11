import type { ReactNode } from "react"

type Props = {
  title: string
  children: ReactNode
  nested?: boolean
}

export default function Section({
  title,
  children,
  nested = false,
}: Props) {
  if (nested) {
    return (
      <div className="space-y-2 pt-2">
        <h3 className="text-lg font-medium">
          {title}
        </h3>
        {children}
      </div>
    )
  }

  return (
    <section className="mb-8 space-y-2">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}
