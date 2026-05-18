import { useState, type RefObject } from 'react'
import { Button } from './ui/Button'
import { generatePDF } from '../utils/pdfGenerator'
import { Download, Loader2 } from 'lucide-react'

interface DownloadButtonProps {
  previewRef: RefObject<HTMLDivElement | null>
}

export function DownloadButton({ previewRef }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      await generatePDF(previewRef)
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
      className="min-w-[140px]"
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
