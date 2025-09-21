'use client'

interface MaliPatternProps {
  className?: string
  variant?: 'geometric' | 'textile' | 'minimal'
}

export default function MaliPattern({ className = '', variant = 'geometric' }: MaliPatternProps) {
  if (variant === 'geometric') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Motifs géométriques inspirés de l'art malien */}
          <defs>
            <pattern id="mali-geometric" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.1" />
              <rect x="8" y="8" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            </pattern>
            <pattern id="mali-diamond" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <polygon points="20,5 35,20 20,35 5,20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mali-geometric)" />
          <rect width="100%" height="100%" fill="url(#mali-diamond)" />
        </svg>
      </div>
    )
  }

  if (variant === 'textile') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="mali-textile" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M25,5 L45,25 L25,45 L5,25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.08"
              />
              <circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mali-textile)" />
        </svg>
      </div>
    )
  }

  // Variant minimal
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-2 h-2 bg-current opacity-10 rounded-full"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-current opacity-15 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-current opacity-5 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-current opacity-12 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-current opacity-8 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-current opacity-6 rounded-full"></div>
      </div>
    </div>
  )
}
