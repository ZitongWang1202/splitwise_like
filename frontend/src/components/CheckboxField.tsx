type Props = {
  label: string
  checked: boolean
  onChange: () => void
}

export default function CheckboxField({
  label,
  checked,
  onChange,
}: Props) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border"
      />
      <span>{label}</span>
    </label>
  )
}
