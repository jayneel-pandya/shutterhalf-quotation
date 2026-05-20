import { useState } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { Button } from './ui/Button'
import { Card, CardBody, CardHeader } from './ui/Card'
import { DAY_LABEL_PRESETS } from '../constants/services'
import { Plus, Trash2, CalendarDays, Edit3 } from 'lucide-react'

export function DayBuilder() {
  const days = useQuotationStore((s) => s.days)
  const addDay = useQuotationStore((s) => s.addDay)
  const removeDay = useQuotationStore((s) => s.removeDay)
  const updateDayLabel = useQuotationStore((s) => s.updateDayLabel)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-ink-800">Event Days</h2>
              <p className="text-xs text-ink-400">Add and customize each day of coverage</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => addDay()}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Day
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {days.length === 0 && (
            <p className="text-sm text-ink-400 text-center py-8">
              No days added yet. Click "Add Day" to begin.
            </p>
          )}
          {days.map((day) => (
            <div
              key={day.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-ink-100 bg-ink-50/50 group hover:border-ink-200 transition-colors"
            >
              {editingId === day.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={day.label}
                    onChange={(e) => updateDayLabel(day.id, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm font-medium bg-white border border-ink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
                    autoFocus
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                  />
                  <div className="flex flex-wrap gap-1">
                    {DAY_LABEL_PRESETS.filter((l) => l !== day.label).slice(0, 4).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          updateDayLabel(day.id, preset)
                          setEditingId(null)
                        }}
                        className="px-2 py-0.5 text-[10px] font-medium bg-brand-50 text-brand-700 rounded border border-brand-200 hover:bg-brand-100 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-700">
                      {days.indexOf(day) + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-ink-800">{day.label}</span>
                  <span className="text-xs text-ink-400">
                    {day.services.length} service{day.services.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === day.id ? null : day.id)}
                  className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                  title="Edit label"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {days.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(day.id)}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Remove day"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {days.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {DAY_LABEL_PRESETS.filter(
              (l) => !days.some((d) => d.label === l)
            ).slice(0, 6).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addDay(preset)}
                className="px-3 py-1 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 rounded-full hover:bg-brand-100 transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
