import { useQuotationStore } from './store/useQuotationStore'
import { StepIndicator } from './components/StepIndicator'
import { LoadQuotation } from './components/LoadQuotation'
import { ClientInfoForm } from './components/ClientInfoForm'
import { DayBuilder } from './components/DayBuilder'
import { ServiceSelector } from './components/ServiceSelector'
import { PostProductionSection } from './components/PostProductionSection'
import { PackagePricing } from './components/PackagePricing'
import { PreviewPanel } from './components/PreviewPanel'
import { Button } from './components/ui/Button'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { BASE_URL } from './utils/baseUrl'

const TOTAL_STEPS = 7

export default function App() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const setCurrentStep = useQuotationStore((s) => s.setCurrentStep)
  const resetAll = useQuotationStore((s) => s.resetAll)

  const stepComponents = [
    <LoadQuotation />,
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={`${BASE_URL}logo.png`}
              alt="Studio Shutter Half"
              className="h-9 sm:h-10 w-auto shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-display font-bold text-ink-800 leading-tight truncate">
                Studio Shutter Half
              </h1>
              <p className="text-[10px] sm:text-[11px] text-ink-400 tracking-wide truncate">Quotation Generator</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={resetAll}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
          <div className="mb-8 no-print">
            <StepIndicator />
          </div>
        )}

        <div className="step-transition">
          {stepComponents[currentStep]}
        </div>

        {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
          <div className="mt-8 flex items-center justify-between no-print">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-400">
                Step {currentStep} of {TOTAL_STEPS - 1}
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
