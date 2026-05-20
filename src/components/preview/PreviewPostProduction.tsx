import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'
import { BASE_URL } from '../../utils/baseUrl'

export function PreviewPostProduction() {
  const pageNum = usePageNumber()
  const items = useQuotationStore((s) => s.postProduction)

  if (items.length === 0) return null

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
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

        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-3 py-2 border-b border-ink-50">
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

        <div className="flex-1" />

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
