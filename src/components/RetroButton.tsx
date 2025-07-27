import { ButtonHTMLAttributes } from 'react'

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function RetroButton({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: RetroButtonProps) {
  const baseStyles = `
    font-bold 
    px-4 
    py-2 
    border-2
    active:translate-x-1
    active:translate-y-1
    transition-all
    duration-100
  `

  const variantStyles = {
    primary: `
      bg-purple-500 
      text-white 
      border-purple-400
      shadow-[4px_4px_0px_0px_rgba(167,139,250,0.5)]
      hover:bg-purple-600
    `,
    secondary: `
      bg-transparent
      text-purple-400
      border-purple-400/50
      shadow-[4px_4px_0px_0px_rgba(167,139,250,0.3)]
      hover:bg-purple-400/10
    `
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

