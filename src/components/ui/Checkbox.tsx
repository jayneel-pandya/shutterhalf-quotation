import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkId = id || `cb-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label
      htmlFor={checkId}
      className={`flex items-center gap-3 py-1.5 px-3 rounded-lg cursor-pointer transition-colors hover:bg-ink-50 group ${className}`}
    >
      <input
        type="checkbox"
        id={checkId}
        className="w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400 focus:ring-offset-1 transition-colors cursor-pointer"
        {...props}
      />
      <span className="text-sm text-ink-700 group-hover:text-ink-900 transition-colors select-none">
        {label}
      </span>
    </label>
  )
}
