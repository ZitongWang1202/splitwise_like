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
      <p className="text-red-600">
        {message}
      </p>
    )
  }