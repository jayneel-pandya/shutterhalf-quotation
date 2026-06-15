import type { ApprovedClient } from '../types'

interface ApprovedClientCardProps {
  client: ApprovedClient
  active: boolean
  onClick: () => void
  assignmentCount: number
  totalRoles: number
}

export function ApprovedClientCard({ client, active, onClick, assignmentCount, totalRoles }: ApprovedClientCardProps) {
  const progress = totalRoles > 0 ? Math.round((assignmentCount / totalRoles) * 100) : 0

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
        active
          ? 'border-brand-400 bg-brand-50 shadow-sm'
          : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
      }`}
    >
      <p className="text-sm font-semibold text-ink-800 truncate">{client.clientName}</p>
      <p className="text-[11px] text-ink-400 mt-0.5 truncate">{client.eventDates}</p>
      {totalRoles > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-ink-400 mb-1">
            <span>{assignmentCount}/{totalRoles} roles assigned</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress === 100 ? 'bg-green-500' : 'bg-brand-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </button>
  )
}
