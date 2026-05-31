import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'
import { BASE_URL } from '../../utils/baseUrl'
import { formatIndianCurrency } from '../../utils/formatCurrency'

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
            <h2 className="text-3xl font-display font-bold text-ink-800 tracking-wide">
              Post Production
            </h2>
          </div>
          <img
            src={`${BASE_URL}logo.png`}
            alt="Studio Shutter Half"
            className="h-7 w-auto opacity-80"
          />
        </div>

        <div className="w-full gold-divider mb-8" />

        <div className="flex-1 flex flex-col">
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-display font-bold text-ink-700 uppercase tracking-wider mb-4">
                Post Production
              </h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 py-1.5">
                    <span className="flex-1 text-base font-bold text-ink-800">{item.name}</span>
                    <div className="flex items-center gap-3">
                      {item.quantity > 1 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-ink-500 uppercase tracking-wider font-bold">Qty</span>
                          <span className="text-base font-bold text-ink-800 tabular-nums">{item.quantity}</span>
                        </div>
                      )}
                      {item.value !== '' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-ink-500 uppercase tracking-wider font-bold">Approx</span>
                          <span className="text-base font-bold text-ink-800 tabular-nums">
                            {item.value}{item.unit ? ` ${item.unit}` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {packageCost && (
            <div className="mt-auto">
              <div className="w-full gold-divider mb-6" />
              <div>
                <p className="text-sm text-ink-500 uppercase tracking-wider font-bold text-center mb-2">
                  Total Package Cost
                </p>
                <p className="text-5xl font-body font-bold text-ink-900 text-center tracking-tight break-words">
                  ₹ {formatIndianCurrency(packageCost)}
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
