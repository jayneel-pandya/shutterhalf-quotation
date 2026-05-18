import { useQuotationStore } from './store/useQuotationStore'
import { StepIndicator } from './components/StepIndicator'
import { ClientInfoForm } from './components/ClientInfoForm'
import { DayBuilder } from './components/DayBuilder'
import { ServiceSelector } from './components/ServiceSelector'
import { PostProductionSection } from './components/PostProductionSection'
import { PackagePricing } from './components/PackagePricing'
import { PreviewPanel } from './components/PreviewPanel'
import { Button } from './components/ui/Button'
import { ArrowLeft, ArrowRight, FileText, RotateCcw, Sparkles } from 'lucide-react'

const TOTAL_STEPS = 6

export default function App() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const setCurrentStep = useQuotationStore((s) => s.setCurrentStep)
  const loadSampleData = useQuotationStore((s) => s.loadSampleData)
  const resetAll = useQuotationStore((s) => s.resetAll)

  const stepComponents = [
    <ClientInfoForm />,
    <DayBuilder />,
    <ServiceSelector />,
    <PostProductionSection />,
    <PackagePricing />,
    <PreviewPanel />,
  ]

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-white border-b border-ink-100 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-ink-800 leading-tight">
                Studio Shutter Half
              </h1>
              <p className="text-[11px] text-ink-400 tracking-wide">Quotation Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadSampleData}>
              <Sparkles className="w-3.5 h-3.5" />
              Sample Data
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAll}>
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {currentStep < TOTAL_STEPS - 1 && (
          <div className="mb-8 no-print">
            <StepIndicator />
          </div>
        )}

        <div className="step-transition">
          {stepComponents[currentStep]}
        </div>

        {currentStep < TOTAL_STEPS - 1 && (
          <div className="mt-8 flex items-center justify-between no-print">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-400">
                Step {currentStep + 1} of {TOTAL_STEPS - 1}
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
