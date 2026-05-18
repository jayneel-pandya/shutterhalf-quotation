import { usePageNumber } from './PageNumberContext'

const terms = [
  'A 50% advance payment is required to confirm the booking. The remaining 50% is due upon delivery of all final deliverables.',
  'The studio reserves the right to use the photographs and videos for promotional purposes unless otherwise agreed in writing.',
  'Any additional hours beyond the agreed coverage will be charged at the applicable hourly rate.',
  'The client is responsible for providing meals for the team if the coverage extends beyond 6 continuous hours.',
  'Final edited photos will be delivered within 4–6 weeks from the date of the event. Highlight videos may take 6–8 weeks.',
  'Travel and accommodation costs for outstation events will be borne by the client.',
  'In the event of cancellation, the advance payment is non-refundable. If cancelled within 7 days of the event, 75% of the total amount is payable.',
  'The studio is not liable for any delays caused by force majeure including but not limited to natural disasters, accidents, or equipment failure.',
  'All raw footage and unedited files remain the intellectual property of Studio Shutter Half unless explicitly purchased.',
  'The client must provide a detailed event schedule at least 7 days prior to the event date.',
]

export function PreviewTerms() {
  const pageNum = usePageNumber()
  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-brand-400 rounded-full" />
          <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
            Terms & Conditions
          </h2>
        </div>

        <div className="w-full gold-divider mb-8" />

        <ol className="space-y-3 flex-1">
          {terms.map((term, i) => (
            <li key={i} className="flex gap-3 text-xs text-ink-600 leading-relaxed">
              <span className="text-brand-500 font-semibold shrink-0 w-5 text-right">
                {i + 1}.
              </span>
              <span>{term}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 pt-6 border-t border-ink-100">
          <p className="text-[10px] text-ink-400 text-center">
            This quotation is valid for 15 days from the date of issue.
          </p>
        </div>

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
