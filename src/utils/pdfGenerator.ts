import type { RefObject } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const A4_WIDTH_MM = 210
const CANVAS_SCALE = 2

export async function generatePDF(previewRef: RefObject<HTMLDivElement | null>): Promise<void> {
  const container = previewRef.current
  if (!container) return

  const pageElements = container.querySelectorAll<HTMLElement>('[data-preview-page]')
  if (!pageElements.length) return

  const pdf = new jsPDF('p', 'mm', 'a4')

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i]

    const originalOverflow = el.style.overflow
    el.style.overflow = 'visible'

    const canvas = await html2canvas(el, {
      scale: CANVAS_SCALE,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
      onclone: (doc) => {
        const cloned = doc.querySelector('[data-preview-page]') as HTMLElement | null
        if (cloned) cloned.style.display = 'flex'
      },
    })

    el.style.overflow = originalOverflow

    const imgData = canvas.toDataURL('image/jpeg', 0.92)

    if (i > 0) {
      pdf.addPage()
    }

    const imgWidth = A4_WIDTH_MM
    const imgHeight = (canvas.height / canvas.width) * imgWidth

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
  }

  pdf.save('Quotation_StudioShutterHalf.pdf')
}
