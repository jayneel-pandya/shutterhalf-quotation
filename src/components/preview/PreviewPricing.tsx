import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'
import { BASE_URL } from '../../utils/baseUrl'

export function PreviewPricing() {
  const pageNum = usePageNumber()
  const packageCost = useQuotationStore((s) => s.packageCost)

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-400 rounded-full" />
            <h2 className="text-xl font-display font-semibold text-ink-800 tracking-wide">
              Pricing Summary
            </h2>
          </div>
          <img
            src={`${BASE_URL}logo.png`}
            alt="Studio Shutter Half"
            className="h-11 w-auto"
          />
        </div>

        <div className="w-full gold-divider mb-8" />

        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-ink-100">
              <p className="text-xs sm:text-sm text-ink-400 uppercase tracking-wider text-center mb-2">
                Total Package Cost
              </p>
              <p className="text-3xl sm:text-4xl font-display font-bold text-ink-800 text-center tracking-wide break-words">
                ₹ {packageCost || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
