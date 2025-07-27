'use client'

export function RetroLoader() {
  return (
    <div className="fixed inset-0 bg-[#1a1a2e]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#16213e] border-2 border-purple-400/50 p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="font-mono text-purple-400 animate-pulse">
            CALCULATING AURA POWER...
          </div>
          
          {/* ASCII Art Loading Animation */}
          <div className="font-mono text-purple-400 flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="inline-block animate-bounce"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                █
              </span>
            ))}
          </div>
          
          {/* Progress Messages */}
          <div className="font-mono text-xs text-gray-400 h-8">
            <div className="animate-typing overflow-hidden whitespace-nowrap border-r-2 border-r-purple-400 pr-1">
              &gt; ANALYZING QUANTUM FLUCTUATIONS...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
