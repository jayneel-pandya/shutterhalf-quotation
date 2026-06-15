import type { ConflictInfo } from '../types'

interface ConflictDialogProps {
  conflicts: ConflictInfo[]
  onCancel: () => void
  onForceAssign: () => void
}

export function ConflictDialog({ conflicts, onCancel, onForceAssign }: ConflictDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-ink-800">Assignment Conflict Detected</h3>
              <p className="text-xs text-ink-400 mt-0.5">The following person(s) are already assigned on this day</p>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
            {conflicts.map((c, i) => (
              <div
                key={i}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm"
              >
                <span className="font-semibold text-red-800">{c.personName}</span>
                <span className="text-red-600"> is already assigned to </span>
                <span className="font-semibold text-red-800">{c.existingClient}</span>
                <span className="text-red-600"> → </span>
                <span className="font-medium text-red-700">{c.existingDay}</span>
                <span className="text-red-600"> as </span>
                <span className="font-medium text-red-700">{c.existingRole}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-ink-400 mb-4">
            Force assigning will override the conflict. The previous assignment status will show as Conflict.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onForceAssign}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Force Assign Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
