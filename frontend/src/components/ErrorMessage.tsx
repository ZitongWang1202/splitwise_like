type ErrorMessageProps = {
  message: string
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps) {

  if (!message) {
    return null
  }

  return (
    <div className="w-0 min-w-full">
      <p className="text-red-600 break-words text-center">
        {message}
      </p>
    </div>
  )
}
