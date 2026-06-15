import { useState, useMemo, useCallback } from 'react'
import type { ApprovedClient, TeamMember, TeamAssignment } from '../types'
import { RoleSelector } from './RoleSelector'
import { batchSaveAssignments } from '../utils/teamSheet'
import { Button } from './ui/Button'
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ClientAssignmentProps {
  client: ApprovedClient
  allMembers: TeamMember[]
  allAssignments: TeamAssignment[]
  onAssignmentsChanged: () => void
}

interface RoleSelection {
  dayLabel: string
  role: string
  quantity: number
  members: string[]
}

function extractRolesFromClient(client: ApprovedClient): { dayLabel: string; role: string; quantity: number }[] {
  if (!client.rawData?.days) return []
  const roles: { dayLabel: string; role: string; quantity: number }[] = []
  for (const day of client.rawData.days) {
    for (const svc of day.services) {
      if (svc.quantity > 0) {
        roles.push({ dayLabel: day.label, role: svc.name, quantity: svc.quantity })
      }
    }
  }
  return roles
}

export function ClientAssignment({ client, allMembers, allAssignments, onAssignmentsChanged }: ClientAssignmentProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const roles = extractRolesFromClient(client)

  const clientAssignments = useMemo(
    () => allAssignments.filter((a) => a.clientName === client.clientName),
    [allAssignments, client.clientName]
  )

  const [selections, setSelections] = useState<RoleSelection[]>(() =>
    roles.map((r) => {
      const existing = clientAssignments.find(
        (a) => a.dayLabel === r.dayLabel && a.role === r.role
      )
      return {
        dayLabel: r.dayLabel,
        role: r.role,
        quantity: r.quantity,
        members: existing ? existing.assignedMembers : [],
      }
    })
  )

  const [forceAssignedRoles, setForceAssignedRoles] = useState<Set<string>>(
    () => new Set(clientAssignments.filter((a) => a.forceAssigned).map((a) => `${a.dayLabel}|${a.role}`))
  )

  const handleRoleChange = useCallback((dayLabel: string, role: string, members: string[], forceAssigned: boolean = false) => {
    setSelections((prev) =>
      prev.map((s) =>
        s.dayLabel === dayLabel && s.role === role ? { ...s, members } : s
      )
    )
    if (forceAssigned) {
      setForceAssignedRoles((prev) => {
        const next = new Set(prev)
        next.add(`${dayLabel}|${role}`)
        return next
      })
    }
    setSaved(false)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const otherAssignments = allAssignments.filter((a) => a.clientName !== client.clientName)
      const myAssignments = selections.map((sel) => ({
        clientName: client.clientName,
        dayLabel: sel.dayLabel,
        role: sel.role,
        quantityNeeded: sel.quantity,
        assignedMembers: sel.members,
        status: 'Active' as const,
        forceAssigned: forceAssignedRoles.has(`${sel.dayLabel}|${sel.role}`),
      }))
      await batchSaveAssignments([...otherAssignments.map(formatExisting), ...myAssignments])
      setSaved(true)
      onAssignmentsChanged()
    } catch {
      setError('Failed to save assignments')
    } finally {
      setSaving(false)
    }
  }

  const groupedByDay = selections.reduce<Record<string, RoleSelection[]>>((acc, s) => {
    if (!acc[s.dayLabel]) acc[s.dayLabel] = []
    acc[s.dayLabel].push(s)
    return acc
  }, {})

  if (roles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-ink-400">No services selected for this client. Assign services first.</p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedByDay).map(([dayLabel, daySelections]) => (
          <div key={dayLabel}>
            <h4 className="text-sm font-display font-semibold text-ink-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              {dayLabel}
            </h4>
            <div className="ml-4 divide-y divide-ink-100">
              {daySelections.map((sel) => (
                <RoleSelector
                  key={`${sel.dayLabel}-${sel.role}`}
                  role={sel.role}
                  quantity={sel.quantity}
                  clientName={client.clientName}
                  dayLabel={sel.dayLabel}
                  selectedMembers={sel.members}
                  allMembers={allMembers}
                  allAssignments={allAssignments}
                  onChange={(members, forceAssigned) => handleRoleChange(sel.dayLabel, sel.role, members, forceAssigned)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Assignments
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saved successfully
          </span>
        )}
      </div>
    </div>
  )
}

function formatExisting(a: TeamAssignment) {
  return {
    clientName: a.clientName,
    dayLabel: a.dayLabel,
    role: a.role,
    quantityNeeded: a.quantityNeeded,
    assignedMembers: a.assignedMembers,
    status: a.status,
    forceAssigned: a.forceAssigned,
  }
}
