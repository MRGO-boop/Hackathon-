interface InteractiveBackgroundProps {
  variant?: 'auth' | 'app'
}

export function InteractiveBackground({ variant = 'app' }: InteractiveBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 ${variant === 'auth' ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  )
}
