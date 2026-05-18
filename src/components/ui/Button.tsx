import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variants = {
  primary:
    'bg-ink-800 text-white hover:bg-ink-700 shadow-sm hover:shadow focus-visible:ring-ink-500',
  secondary:
    'bg-brand-100 text-brand-800 hover:bg-brand-200 border border-brand-200 focus-visible:ring-brand-500',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 focus-visible:ring-ink-500',
  danger:
    'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 focus-visible:ring-red-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
