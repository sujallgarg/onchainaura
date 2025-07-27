interface BrowserWindowProps {
    title: string
    children: React.ReactNode
    variant?: 'light' | 'dark'
  }
  
  export function BrowserWindow({ 
    title, 
    children, 
    variant = 'light' 
  }: BrowserWindowProps) {
    const isDark = variant === 'dark'
    
    return (
      <div className={`border-2 ${
        isDark 
          ? 'border-purple-400/50 bg-[#16213e] shadow-[4px_4px_0px_0px_rgba(167,139,250,0.3)]' 
          : 'border-[#9d5c9d] bg-[#e8f4e5] shadow-[4px_4px_0px_0px_rgba(157,92,157,1)]'
      }`}>
        {/* Title Bar */}
        <div className={`px-2 py-1 flex items-center justify-between ${
          isDark ? 'bg-purple-400/20' : 'bg-[#9d5c9d]'
        }`}>
          <div className={`font-bold tracking-wide text-sm ${
            isDark ? 'text-purple-400' : 'text-white'
          }`}>
            {title}
          </div>
          <div className="flex gap-1">
            {[
              isDark ? '#a78bfa' : '#ffd4e5',
              isDark ? '#818cf8' : '#e8f4e5',
              isDark ? '#c084fc' : '#fffbf0'
            ].map((color) => (
              <div
                key={color}
                className={`w-3 h-3 ${isDark ? 'border-purple-400/50' : 'border-white'} border`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="h-[calc(100%-28px)]">
          {children}
        </div>
      </div>
    )
  }
    