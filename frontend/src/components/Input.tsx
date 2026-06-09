import type { ChangeEvent } from "react"

type InputProps = {
    value: string
    onChange: (
        event: ChangeEvent<HTMLInputElement>
    ) => void
    placeholder?: string
    type?: string
    disabled?: boolean
}

export default function Input({
    value,
    onChange,
    placeholder,
    type = "text",
    disabled = false,
}: InputProps) {
    return (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            className="
                w-full
                border
                rounded-lg
                p-3
                shadow-sm
                disabled:opacity-50
      "
        />
    )
}