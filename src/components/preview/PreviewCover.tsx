import { usePageNumber } from './PageNumberContext'

export function PreviewCover() {
  const pageNum = usePageNumber()
  const quoteNumber = `Q-${String(new Date().getFullYear()).slice(2)}${String(Math.floor(Math.random() * 9000) + 1000)}`
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div data-preview-page className="preview-page">
      <div className="preview-page-inner items-center justify-center text-center">
        <div className="mb-12">
          <div className="w-20 h-20 rounded-full border-2 border-brand-300 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-display font-bold text-brand-600">SH</span>
          </div>
          <p className="text-xs text-ink-400 tracking-[4px] uppercase mb-1">Studio</p>
          <h1 className="text-4xl font-display font-bold text-ink-800 tracking-[3px]">
            SHUTTER HALF
          </h1>
          <p className="text-xs text-ink-400 tracking-[6px] uppercase mt-1">Photography</p>
        </div>

        <div className="w-24 gold-divider mx-auto mb-10" />

        <h2 className="text-5xl font-display font-light text-ink-800 tracking-[8px] uppercase mb-4">
          Quotation
        </h2>

        <div className="w-16 gold-divider mx-auto mb-8" />

        <div className="space-y-2 text-sm text-ink-400">
          <p>Quote No: <span className="text-ink-600 font-medium">{quoteNumber}</span></p>
          <p>Date: <span className="text-ink-600 font-medium">{today}</span></p>
        </div>

        <div className="mt-auto pt-12">
          <p className="text-[10px] text-ink-300 tracking-[2px] uppercase">
            Wedding &bull; Event &bull; Commercial Photography
          </p>
        </div>

        <div className="page-number">{pageNum}</div>
      </div>
    </div>
  )
}
