import { useQuotationStore } from '../store/useQuotationStore'
import { AVAILABLE_POST_PRODUCTION } from '../constants/services'
import { Card, CardBody, CardHeader } from './ui/Card'
import { Badge } from './ui/Badge'
import { Film, Minus, Plus } from 'lucide-react'

export function PostProductionSection() {
  const items = useQuotationStore((s) => s.postProduction)
  const toggleItem = useQuotationStore((s) => s.togglePostProduction)
  const updateValue = useQuotationStore((s) => s.updatePostProductionValue)
  const updateQuantity = useQuotationStore((s) => s.updatePostProductionQuantity)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <Film className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-ink-800">Post Production</h2>
            <p className="text-xs text-ink-400">Select deliverables and enter approximate values</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-ink-400">
            Check the items to include in the quotation
          </p>
          <Badge variant="brand">
            {items.length} selected
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AVAILABLE_POST_PRODUCTION.map((pp) => {
            const isSelected = items.some((i) => i.name === pp.name)
            const selectedItem = items.find((i) => i.name === pp.name)

            return (
              <div
                key={pp.name}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 ${
                  isSelected
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-transparent hover:border-ink-200 hover:bg-ink-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItem(pp.name)}
                  className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-ink-800">{pp.name}</span>
                  {pp.spec && (
                    <span className="block text-[11px] text-ink-400 mt-0.5">({pp.spec})</span>
                  )}
                  {isSelected && selectedItem && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-ink-500 font-medium">Approx</span>
                      <input
                        type="text"
                        value={selectedItem.value}
                        onChange={(e) => {
                          updateValue(pp.name, e.target.value)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-2 py-1 text-sm text-center bg-white border border-ink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
                        placeholder="e.g. 30-40"
                      />
                      {pp.unit && (
                        <span className="text-xs text-ink-500">{pp.unit}</span>
                      )}
                      <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(pp.name, selectedItem.quantity - 1)}
                          disabled={selectedItem.quantity <= 1}
                          className="p-0.5 rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-ink-800 tabular-nums">
                          {selectedItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(pp.name, selectedItem.quantity + 1)}
                          className="p-0.5 rounded text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
