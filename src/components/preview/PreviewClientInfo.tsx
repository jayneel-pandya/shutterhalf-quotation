import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'

export function PreviewClientInfo() {
  const pageNum = usePageNumber()
  const clientName = useQuotationStore((s) => s.clientName)
  const contactNumber = useQuotationStore((s) => s.contactNumber)
  const venue = useQuotationStore((s) => s.venue)
  const location = useQuotationStore((s) => s.location)
  const eventDates = useQuotationStore((s) => s.eventDates)

  const details = [
    { label: 'Client Name', value: clientName },
    { label: 'Contact Number', value: contactNumber },
    { label: 'Venue', value: venue },
    { label: 'Location', value: location },
    { label: 'Event Dates', value: eventDates },
  ]

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
              Client Information
            </h2>
          </div>
          <img
            src="/studioshutterhalf/logo.svg"
            alt="Studio Shutter Half"
            className="h-7 w-auto opacity-80"
          />
        </div>

        <div className="w-full gold-divider mb-8" />

        <div className="space-y-1">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-baseline py-3 border-b border-ink-50 last:border-b-0"
            >
              <span className="sm:w-44 text-xs text-ink-400 uppercase tracking-wider font-medium">
                {label}
              </span>
              <span className="text-sm text-ink-800 font-medium">
                {value || '—'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
