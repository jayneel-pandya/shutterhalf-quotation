import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'
import { BASE_URL } from '../../utils/baseUrl'

const svcIcons: Record<string, string> = {
  Cinematographer: '🎥',
  'Candid Photographer': '📷',
  'Ritual Photographer': '📸',
  'Ritual Videographer': '🎬',
  Drone: '🛸',
  'Live Setup': '🔧',
  'FPV Drone': '🛩️',
}

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
        <BatchPage key={bi} batch={batch} allDays={days} />
      ))}
    </>
  )
}

function BatchPage({ batch, allDays }: {
  batch: { label: string; services: { name: string; quantity: number }[] }[]
  allDays: { label: string }[]
}) {
  const pageNum = usePageNumber()
  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-md bg-brand-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-700">
                    {allDays.findIndex((d) => d.label === day.label) + 1}
                  </span>
                </div>
                <h3 className="text-base font-display font-semibold text-ink-800 tracking-wide">
                  {day.label}
                </h3>
              </div>

              <div className="space-y-0.5 ml-10">
                {day.services.map((svc: { name: string; quantity: number }) => (
                  <div
                    key={svc.name}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-ink-50/50"
                  >
                    <span className="text-base">{svcIcons[svc.name] || '📋'}</span>
                    <span className="flex-1 text-sm text-ink-700">{svc.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-400">Qty:</span>
                      <span className="text-sm font-semibold text-ink-800 tabular-nums">
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
