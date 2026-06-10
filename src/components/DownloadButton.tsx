import { useState, type RefObject } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { Button } from './ui/Button'
import { generatePDF } from '../utils/pdfGenerator'
import { submitToSheet } from '../utils/submitToSheet'
import { Download, Loader2, AlertCircle, X } from 'lucide-react'

interface DownloadButtonProps {
  previewRef: RefObject<HTMLDivElement | null>
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function DownloadButton({ previewRef }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const store = useQuotationStore()

  const handleDownload = async () => {
    setLoading(true)
    setError('')
    try {
      const {
        clientName, contactNumber, venue, location,
        eventDates, days, postProduction, packageCost,
        originalSnapshot,
      } = store

      const changedSections = originalSnapshot
        ? {
            services: !deepEqual(originalSnapshot.days, days),
            postProduction: !deepEqual(originalSnapshot.postProduction, postProduction),
            packageCost: originalSnapshot.packageCost !== packageCost,
          }
        : undefined

      const [_, sheetResult] = await Promise.all([
        generatePDF(previewRef, clientName),
        submitToSheet({
          clientName, contactNumber, venue, location,
          eventDates, days, postProduction, packageCost,
          changedSections,
        }),
      ])

      if (!sheetResult.success) {
        setError(sheetResult.error || 'Quotation was not logged to Google Sheets. Check console for details.')
      }
    } catch (err) {
      setError('Download process failed. Check console for details.')
      console.error('Download process failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="flex items-start gap-2 w-full p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError('')} className="shrink-0 p-0.5 rounded hover:bg-red-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <Button
        variant="primary"
        size="md"
        onClick={handleDownload}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download PDF
          </>
        )}
      </Button>
    </div>
  )
}
