import { useState } from 'react'
import type { TeamMember } from '../types'
import { AVAILABLE_SERVICES } from '../constants/services'

interface TeamMemberFormProps {
  initial?: TeamMember
  onSave: (data: Omit<TeamMember, 'id'>) => void
  onCancel: () => void
}

export function TeamMemberForm({ initial, onSave, onCancel }: TeamMemberFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [role, setRole] = useState(initial?.role || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [status, setStatus] = useState<'Active' | 'Inactive'>(initial?.status || 'Active')
  const [customRole, setCustomRole] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    if (!role.trim()) { setError('Role is required'); return }

    setSaving(true)
    setError('')
    try {
      await onSave({ name: name.trim(), role: role.trim(), phone: phone.trim(), notes: notes.trim(), status })
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          placeholder="Full name"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-1">Role *</label>
        {customRole ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              placeholder="Custom role"
            />
            <button
              type="button"
              onClick={() => { setCustomRole(false); setRole('') }}
              className="px-3 py-2 text-xs text-ink-500 hover:text-ink-700"
            >
              Presets
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            >
              <option value="">Select role...</option>
              {AVAILABLE_SERVICES.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setCustomRole(true)}
              className="px-3 py-2 text-xs text-ink-500 hover:text-ink-700 whitespace-nowrap"
            >
              Custom
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-1">Status</label>
        <button
          type="button"
          onClick={() => setStatus(status === 'Active' ? 'Inactive' : 'Active')}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
            status === 'Active'
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-ink-50 border-ink-200 text-ink-500'
          }`}
        >
          <span className={`w-8 h-4 rounded-full transition-colors relative ${
            status === 'Active' ? 'bg-green-500' : 'bg-ink-300'
          }`}>
            <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${
              status === 'Active' ? 'left-[18px]' : 'left-0.5'
            }`} />
          </span>
          <span className="font-medium">{status}</span>
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          placeholder="Contact number"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-500 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
          placeholder="Optional notes"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-700 rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : initial ? 'Update' : 'Add Member'}
        </button>
      </div>
    </form>
  )
}
