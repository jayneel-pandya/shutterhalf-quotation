import { useQuotationStore } from '../store/useQuotationStore'
import { AVAILABLE_SERVICES } from '../constants/services'
import { Card, CardBody, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
import { Camera, Minus, Plus } from 'lucide-react'

export function ServiceSelector() {
  const days = useQuotationStore((s) => s.days)
  const toggleService = useQuotationStore((s) => s.toggleService)
  const updateServiceQuantity = useQuotationStore((s) => s.updateServiceQuantity)

  if (days.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <Camera className="w-10 h-10 text-ink-300 mx-auto mb-3" />
            <p className="text-sm text-ink-400">No event days created yet.</p>
            <p className="text-xs text-ink-300">Go back to "Event Days" and add at least one day.</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {days.map((day) => {
        const dayServices = day.services
        return (
          <Card key={day.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-700">
                      {days.indexOf(day) + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-semibold text-ink-800">{day.label}</h3>
                </div>
                <Badge variant="brand">
                  {dayServices.length} selected
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {AVAILABLE_SERVICES.map((svc) => {
                  const isSelected = dayServices.some((s) => s.name === svc.name)
                  const selectedSvc = dayServices.find((s) => s.name === svc.name)

                  return (
                    <div
                      key={svc.name}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-brand-300 bg-brand-50'
                          : 'border-transparent hover:border-ink-200 hover:bg-ink-50'
                      }`}
                      onClick={() => toggleService(day.id, svc.name)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm text-ink-700 truncate">{svc.name}</span>
                        <span className="block text-[10px] text-ink-400">{svc.category}</span>
                      </div>
                      {isSelected && selectedSvc && (
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => updateServiceQuantity(day.id, svc.name, selectedSvc.quantity - 1)}
                            disabled={selectedSvc.quantity <= 1}
                            className="p-0.5 rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 disabled:opacity-30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-ink-800 tabular-nums">
                            {selectedSvc.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateServiceQuantity(day.id, svc.name, selectedSvc.quantity + 1)}
                            className="p-0.5 rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
