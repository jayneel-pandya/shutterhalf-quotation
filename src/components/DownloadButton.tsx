import { useState, type RefObject } from 'react'
import { useQuotationStore } from '../store/useQuotationStore'
import { Button } from './ui/Button'
import { generatePDF } from '../utils/pdfGenerator'
import { submitToSheet } from '../utils/submitToSheet'
import { Download, Loader2 } from 'lucide-react'

interface DownloadButtonProps {
  previewRef: RefObject<HTMLDivElement | null>
}

export function DownloadButton({ previewRef }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const store = useQuotationStore()

  const handleDownload = async () => {
    setLoading(true)
    try {
      const {
        clientName, contactNumber, venue, location,
        eventDates, days, postProduction, packageCost,
      } = store

      await Promise.all([
        generatePDF(previewRef, clientName),
        submitToSheet({
          clientName, contactNumber, venue, location,
          eventDates, days, postProduction, packageCost,
        }),
      ])
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
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
  )
}
