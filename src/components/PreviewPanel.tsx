import { useRef } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { PageProvider } from './preview/PageNumberContext'
import { PreviewClientInfo } from './preview/PreviewClientInfo'
import { PreviewDayServices } from './preview/PreviewDayServices'
import { PreviewPostProduction } from './preview/PreviewPostProduction'
import { PreviewPricing } from './preview/PreviewPricing'
import { DownloadButton } from './DownloadButton'
import { Button } from './ui/Button'
import { ArrowLeft, Eye } from 'lucide-react'

export function PreviewPanel() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const setCurrentStep = useQuotationStore((s) => s.setCurrentStep)
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <Eye className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-ink-800">Quotation Preview</h2>
            <p className="text-xs text-ink-400">Review the complete quotation before downloading</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Edit
          </Button>
          <DownloadButton previewRef={previewRef} />
        </div>
      </div>

      <div ref={previewRef} className="space-y-8 pb-8">
        <PageProvider>
          <PreviewClientInfo />
          <PreviewDayServices />
          <PreviewPostProduction />
          <PreviewPricing />
        </PageProvider>
      </div>
    </div>
  )
}
