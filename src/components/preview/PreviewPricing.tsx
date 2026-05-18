import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'

export function PreviewPricing() {
  const pageNum = usePageNumber()
  const packageCost = useQuotationStore((s) => s.packageCost)

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
              Pricing Summary
            </h2>
          </div>

          <div className="w-full gold-divider mb-8" />

          <div className="max-w-md mx-auto w-full">
            <div className="bg-ink-50 rounded-xl p-6 border border-ink-100">
              <p className="text-xs text-ink-400 uppercase tracking-wider text-center mb-2">
                Total Package Cost
              </p>
              <p className="text-3xl font-display font-bold text-ink-800 text-center tracking-wide">
                {packageCost || 'Not specified'}
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-ink-400 leading-relaxed">
                The above pricing includes all services and post-production
                deliverables as mentioned in this quotation.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-4 text-xs text-ink-400">
                <div className="text-center">
                  <p className="font-semibold text-ink-600">50%</p>
                  <p>Advance Payment</p>
                </div>
                <div className="w-px h-8 bg-ink-200" />
                <div className="text-center">
                  <p className="font-semibold text-ink-600">50%</p>
                  <p>On Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
