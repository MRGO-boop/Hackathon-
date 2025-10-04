import * as React from "react"

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode
}

export function ImageWithFallback({ src, alt, fallback, className = "", ...props }: ImageWithFallbackProps) {
  const [error, setError] = React.useState(false)

  if (error && fallback) {
    return <>{fallback}</>
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  )
}
