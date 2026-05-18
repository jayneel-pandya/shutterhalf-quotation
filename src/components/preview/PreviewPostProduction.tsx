import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'

export function PreviewPostProduction() {
  const pageNum = usePageNumber()
  const items = useQuotationStore((s) => s.postProduction)

  if (items.length === 0) return null

  const mid = Math.ceil(items.length / 2)
  const leftCol = items.slice(0, mid)
  const rightCol = items.slice(mid)

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-brand-400 rounded-full" />
          <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
            Post Production
          </h2>
        </div>

        <div className="w-full gold-divider mb-8" />

        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
          {leftCol.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-ink-50">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
              <span className="text-sm text-ink-700">{item.name}</span>
            </div>
          ))}
          {rightCol.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-ink-50">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
              <span className="text-sm text-ink-700">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
