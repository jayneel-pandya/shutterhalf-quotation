import { useQuotationStore } from '../store/useQuotationStore'
import { STEP_LABELS } from '../constants/services'
import { Check } from 'lucide-react'

export function StepIndicator() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const setCurrentStep = useQuotationStore((s) => s.setCurrentStep)

  return (
    <nav className="w-full" aria-label="Form steps">
      <ol className="flex items-center justify-between">
        {STEP_LABELS.map((label, index) => {
          const step = index
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const isClickable = step <= currentStep

          return (
            <li key={label} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => isClickable && setCurrentStep(step)}
                disabled={!isClickable}
                className={`flex items-center gap-2.5 group ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-ink-800 text-white ring-4 ring-ink-100'
                      : isCompleted
                      ? 'bg-brand-500 text-white'
                      : 'bg-ink-100 text-ink-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step + 1
                  )}
                </span>
                <span
                  className={`hidden md:block text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-ink-800'
                      : isCompleted
                      ? 'text-brand-700'
                      : 'text-ink-400'
                  }`}
                >
                  {label}
                </span>
              </button>
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 transition-colors duration-300 ${
                    isCompleted ? 'bg-brand-300' : 'bg-ink-200'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
