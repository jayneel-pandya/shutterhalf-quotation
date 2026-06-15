import { useState, useRef, useEffect } from 'react'
import type { TeamMember } from '../types'

interface MemberMultiSelectProps {
  members: TeamMember[]
  selected: string[]
  onChange: (selected: string[]) => void
  max: number
  placeholder?: string
}

export function MemberMultiSelect({ members, selected, onChange, max, placeholder }: MemberMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleMember = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name))
    } else {
      if (selected.length >= max) return
      onChange([...selected, name])
    }
  }

  const handleRemove = (name: string) => {
    onChange(selected.filter((s) => s !== name))
  }

  const atMax = selected.length >= max

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[36px] px-3 py-1.5 text-sm bg-white border border-ink-200 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent flex flex-wrap gap-1 items-center"
      >
        {selected.length === 0 ? (
          <span className="text-ink-400">{placeholder || 'Select members...'}</span>
        ) : (
          selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-100 text-brand-800 rounded-full text-xs"
            >
              {name}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(name) }}
                className="hover:text-brand-900 font-bold"
              >
                &times;
              </button>
            </span>
          ))
        )}
        <span className="ml-auto text-[10px] text-ink-400 shrink-0">
          {selected.length}/{max}
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-ink-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-ink-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1 text-xs border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="p-3 text-center text-xs text-ink-400">
              {members.length === 0 ? 'No team members with this role' : 'No matches'}
            </div>
          ) : (
            filtered.map((m) => {
              const isSelected = selected.includes(m.name)
              const disabled = !isSelected && atMax
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleMember(m.name)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                    isSelected ? 'bg-brand-50' : disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-ink-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-ink-800 truncate">{m.name}</span>
                    {m.phone && (
                      <span className="block text-[10px] text-ink-400 truncate">{m.phone}</span>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
