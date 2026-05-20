import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'
import { BASE_URL } from '../../utils/baseUrl'

export function PreviewPostProductionPricing() {
  const pageNum = usePageNumber()
  const items = useQuotationStore((s) => s.postProduction)
  const packageCost = useQuotationStore((s) => s.packageCost)

  if (items.length === 0 && !packageCost) return null

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
              Post Production & Pricing
            </h2>
          </div>
          <img
            src={`${BASE_URL}logo.png`}
            alt="Studio Shutter Half"
            className="h-11 w-auto"
          />
        </div>

        <div className="w-full gold-divider mb-8" />

        <div className="flex-1 flex flex-col">
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-display font-semibold text-ink-600 uppercase tracking-wider mb-3">
                Post Production
              </h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 py-1.5 border-b border-ink-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                    <span className="flex-1 text-sm text-ink-700">{item.name}</span>
                    {item.value > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-ink-400 uppercase tracking-wider">Approx</span>
                        <span className="text-sm font-semibold text-ink-800 tabular-nums">
                          {item.value}{item.unit ? ` ${item.unit}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {packageCost && (
            <div className="mt-auto">
              <div className="w-full gold-divider mb-6" />
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-ink-100">
                <p className="text-xs text-ink-400 uppercase tracking-wider text-center mb-2">
                  Total Package Cost
                </p>
                <p className="text-3xl font-display font-bold text-ink-800 text-center tracking-wide break-words">
                  ₹ {packageCost}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
