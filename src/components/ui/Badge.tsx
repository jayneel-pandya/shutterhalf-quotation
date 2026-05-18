import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'brand' | 'outline'
  className?: string
}

const badgeVariants = {
  default: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-100 text-brand-700',
  outline: 'bg-transparent border border-ink-200 text-ink-600',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
