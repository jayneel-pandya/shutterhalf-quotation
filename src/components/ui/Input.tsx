import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-ink-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-800 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  )
}
