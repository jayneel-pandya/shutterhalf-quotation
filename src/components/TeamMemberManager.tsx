import { useState, useEffect } from 'react'
import type { TeamMember } from '../types'
import { TeamMemberForm } from './TeamMemberForm'
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../utils/teamSheet'
import { Button } from './ui/Button'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Users } from 'lucide-react'

export function TeamMemberManager() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    getTeamMembers()
      .then((data) => { setMembers(data); setError('') })
      .catch(() => setError('Failed to load team members'))
      .finally(() => setLoading(false))
  }, [refreshKey])

  const roles = [...new Set(members.map((m) => m.role))].sort()

  const filtered = roleFilter
    ? members.filter((m) => m.role === roleFilter)
    : members

  const handleAdd = async (data: Omit<TeamMember, 'id'>) => {
    await addTeamMember(data)
    setShowForm(false)
    setRefreshKey((k) => k + 1)
  }

  const handleUpdate = async (data: Omit<TeamMember, 'id'>) => {
    if (!editing) return
    await updateTeamMember({ ...data, id: editing.id } as TeamMember)
    setEditing(null)
    setRefreshKey((k) => k + 1)
  }

  const handleDelete = async (id: number) => {
    await deleteTeamMember(id)
    setDeleteConfirm(null)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div>
      {error && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <span className="text-xs text-ink-400">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-3.5 h-3.5" />
          Add Member
        </Button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6 p-4 bg-ink-50 border border-ink-200 rounded-xl">
          <h4 className="text-sm font-display font-semibold text-ink-700 mb-3">
            {editing ? 'Edit Member' : 'Add New Member'}
          </h4>
          <TeamMemberForm
            initial={editing || undefined}
            onSave={editing ? handleUpdate : handleAdd}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-ink-400" />
          <span className="ml-2 text-sm text-ink-500">Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-8 h-8 text-ink-300 mx-auto mb-2" />
          <p className="text-sm text-ink-400">
            {members.length === 0 ? 'No team members yet. Add your first member.' : 'No members match this role.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden md:table-cell">Notes</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-ink-100 hover:bg-ink-50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-ink-800">{m.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      m.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-ink-100 text-ink-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        m.status === 'Active' ? 'bg-green-500' : 'bg-ink-400'
                      }`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-ink-500 hidden sm:table-cell">{m.phone || '-'}</td>
                  <td className="py-2.5 px-3 text-ink-400 text-xs hidden md:table-cell">{m.notes || '-'}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(m)}
                        className="p-1.5 text-ink-400 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirm === m.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(m.id)}
                            className="px-2 py-1 text-[10px] font-medium text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-[10px] font-medium text-ink-600 bg-ink-100 rounded hover:bg-ink-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(m.id)}
                          className="p-1.5 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
