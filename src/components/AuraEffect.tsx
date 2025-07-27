'use client'

interface AuraEffectProps {
  score: number
}

export function AuraEffect({ score }: AuraEffectProps) {
  const intensity = score / 100

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {/* Gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255,182,255,${0.2 + (intensity * 0.3)}) 0%,
              rgba(166,104,255,${0.2 + (intensity * 0.3)}) 50%,
              rgba(146,167,255,${0.2 + (intensity * 0.3)}) 100%
            )
          `
        }}
      />

      {/* Centered ripples */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-ripple"
            style={{
              width: `${300 + (i * 200)}px`,
              height: `${300 + (i * 200)}px`,
              border: `1px solid rgba(255, 223, 128, ${0.1 + (intensity * 0.2)})`,
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-float"
          style={{
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            background: `radial-gradient(circle at center, 
              rgba(255,223,128,${0.1 + (intensity * 0.2)}),
              rgba(255,182,255,${0.05 + (intensity * 0.1)})
            )`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  )
}
