import { useState, useMemo } from 'react'
import type { TeamMember, TeamAssignment, ConflictInfo } from '../types'
import { MemberMultiSelect } from './MemberMultiSelect'
import { ConflictDialog } from './ConflictDialog'

interface RoleSelectorProps {
  role: string
  quantity: number
  clientName: string
  dayLabel: string
  selectedMembers: string[]
  allMembers: TeamMember[]
  allAssignments: TeamAssignment[]
  onChange: (members: string[], forceAssigned: boolean) => void
}

export function RoleSelector({ role, quantity, clientName, dayLabel, selectedMembers, allMembers, allAssignments, onChange }: RoleSelectorProps) {
  const [pendingSelection, setPendingSelection] = useState<string[] | null>(null)
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([])

  const filteredMembers = useMemo(
    () => allMembers.filter((m) => m.role.toLowerCase() === role.toLowerCase() && m.status === 'Active'),
    [allMembers, role]
  )

  const handleChange = (newSelected: string[]) => {
    const added = newSelected.filter((n) => !selectedMembers.includes(n))
    if (added.length === 0) {
      onChange(newSelected, false)
      return
    }

    const allConflicts: ConflictInfo[] = []
    for (const person of added) {
      for (const a of allAssignments) {
        if (a.clientName === clientName) continue
        if (a.dayLabel !== dayLabel) continue
        if (a.status !== 'Active') continue
        if (a.assignedMembers.indexOf(person) !== -1) {
          allConflicts.push({
            personName: person,
            existingClient: a.clientName,
            existingDay: a.dayLabel,
            existingRole: a.role,
          })
        }
      }
    }

    if (allConflicts.length > 0) {
      setPendingSelection(newSelected)
      setConflicts(allConflicts)
    } else {
      onChange(newSelected, false)
    }
  }

  const handleForceAssign = () => {
    if (pendingSelection) {
      onChange(pendingSelection, true)
    }
    setPendingSelection(null)
    setConflicts([])
  }

  const handleCancelConflict = () => {
    setPendingSelection(null)
    setConflicts([])
  }

  return (
    <div className="flex items-start gap-4 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-ink-700">{role}</span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ink-100 text-[10px] font-bold text-ink-600">
            {quantity}
          </span>
        </div>
        <MemberMultiSelect
          members={filteredMembers}
          selected={selectedMembers}
          onChange={handleChange}
          max={quantity}
          placeholder={`Select ${role}...`}
        />
      </div>

      {conflicts.length > 0 && (
        <ConflictDialog
          conflicts={conflicts}
          onCancel={handleCancelConflict}
          onForceAssign={handleForceAssign}
        />
      )}
    </div>
  )
}
