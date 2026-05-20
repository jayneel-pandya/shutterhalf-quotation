import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'
import { BASE_URL } from '../../utils/baseUrl'

export function PreviewDayServices() {
  const days = useQuotationStore((s) => s.days)

  if (days.length === 0) return null

  const pageBreaks: { label: string; services: { name: string; quantity: number }[] }[][] = []
  let currentBatch: { label: string; services: { name: string; quantity: number }[] }[] = []
  let currentCount = 0

  for (const day of days) {
    if (day.services.length === 0) continue
    const itemCount = 1 + day.services.length
    if (currentCount + itemCount > 20 && currentBatch.length > 0) {
      pageBreaks.push(currentBatch)
      currentBatch = []
      currentCount = 0
    }
    currentBatch.push({ label: day.label, services: day.services })
    currentCount += itemCount
  }
  if (currentBatch.length > 0) {
    pageBreaks.push(currentBatch)
  }

  return (
    <>
      {pageBreaks.map((batch, bi) => (
        <BatchPage key={bi} batch={batch} />
      ))}
    </>
  )
}

function BatchPage({ batch }: {
  batch: { label: string; services: { name: string; quantity: number }[] }[]
}) {
  const pageNum = usePageNumber()
  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-2xl font-display font-bold text-ink-800 tracking-wide">
              Event Coverage
            </h2>
          </div>
          <img
            src={`${BASE_URL}logo.png`}
            alt="Studio Shutter Half"
            className="h-7 w-auto opacity-80"
          />
        </div>

        <div className="w-full gold-divider mb-8" />

        <div className="space-y-8">
          {batch.map((day, di) => (
            <div key={di}>
              <h3 className="text-lg font-display font-bold text-ink-800 tracking-wide mb-4">
                {day.label}
              </h3>

              <div className="space-y-1">
                {day.services.map((svc: { name: string; quantity: number }) => (
                  <div
                    key={svc.name}
                    className="flex items-center gap-3 py-1.5 border-b border-ink-50"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                    <span className="flex-1 text-sm font-semibold text-ink-800">{svc.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-500 font-semibold">Qty:</span>
                      <span className="text-sm font-bold text-ink-800 tabular-nums">
                        {svc.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1" />
        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
