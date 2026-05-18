import { useQuotationStore } from '../../store/useQuotationStore'
import { usePageNumber } from './PageNumberContext'

export function PreviewThankYou() {
  const pageNum = usePageNumber()
  const clientName = useQuotationStore((s) => s.clientName)

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner items-center justify-center text-center">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-brand-300 mx-auto mb-3 flex items-center justify-center">
            <span className="text-xl font-display font-bold text-brand-600">SH</span>
          </div>
        </div>

        <h2 className="text-3xl font-display font-light text-ink-800 tracking-[4px] mb-4">
          Thank You
        </h2>

        <div className="w-16 gold-divider mx-auto mb-6" />

        <p className="text-sm text-ink-500 leading-relaxed max-w-sm mx-auto">
          Dear <span className="text-ink-800 font-semibold">{clientName || 'Valued Client'}</span>,
          thank you for considering Studio Shutter Half for your special occasion.
          We look forward to capturing your precious moments with creativity and passion.
        </p>

        <div className="mt-10 space-y-1 text-xs text-ink-400">
          <p>Studio Shutter Half</p>
          <p>contact@studioshutterhalf.com</p>
          <p>+91 98765 43210</p>
        </div>

        <div className="mt-auto pt-12">
          <p className="text-[9px] text-ink-300 tracking-[3px] uppercase">
            &copy; {new Date().getFullYear()} Studio Shutter Half &bull; All Rights Reserved
          </p>
        </div>

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
