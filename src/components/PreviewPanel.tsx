import { useRef, useState, useEffect } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { PageProvider } from './preview/PageNumberContext'
import { PreviewClientInfo } from './preview/PreviewClientInfo'
import { PreviewDayServices } from './preview/PreviewDayServices'
import { PreviewPostProductionPricing } from './preview/PreviewPostProductionPricing'
import { DownloadButton } from './DownloadButton'
import { Button } from './ui/Button'
import { ArrowLeft, Eye } from 'lucide-react'

const A4_WIDTH_PX = 793.7

export function PreviewPanel() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const setCurrentStep = useQuotationStore((s) => s.setCurrentStep)
  const previewRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const scaleObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
        setScale(Math.min(width / A4_WIDTH_PX, 1))
      }
    })

    scaleObserver.observe(wrapper)
    return () => scaleObserver.disconnect()
  }, [])

  useEffect(() => {
    const content = previewRef.current
    if (!content) return

    const heightObserver = new ResizeObserver(() => {
      setContentHeight(content.scrollHeight)
    })

    heightObserver.observe(content)
    return () => heightObserver.disconnect()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between no-print gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-brand-700" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-display font-semibold text-ink-800 truncate">Quotation Preview</h2>
            <p className="text-xs text-ink-400 truncate">Review the complete quotation before downloading</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 sm:flex-none">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Edit</span>
          </Button>
          <DownloadButton previewRef={previewRef} />
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="preview-page-wrapper"
        style={{ height: contentHeight ? `${contentHeight * scale}px` : undefined }}
      >
        <div
          ref={previewRef}
          className="space-y-8 pb-8"
          style={{
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
          }}
        >
          <PageProvider>
            <PreviewClientInfo />
            <PreviewDayServices />
            <PreviewPostProductionPricing />
          </PageProvider>
        </div>
      </div>
    </div>
  )
}
