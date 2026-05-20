import type { RefObject } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PDFDocument } from 'pdf-lib'
import { BASE_URL } from './baseUrl'

const A4_WIDTH_MM = 210
const CANVAS_SCALE = 2

async function fetchPDFBuffer(path: string): Promise<ArrayBuffer> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}`)
  return res.arrayBuffer()
}

async function captureToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
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
  })

  el.style.overflow = originalOverflow
  return canvas
}

export async function generatePDF(previewRef: RefObject<HTMLDivElement | null>, clientName?: string): Promise<void> {
  const container = previewRef.current
  if (!container) return

  const allPages = container.querySelectorAll<HTMLElement>('[data-preview-page]')
  if (allPages.length === 0) return

  const middleElements = Array.from(allPages)

  const middlePdf = new jsPDF('p', 'mm', 'a4')

  for (let i = 0; i < middleElements.length; i++) {
    const canvas = await captureToCanvas(middleElements[i])
    const imgData = canvas.toDataURL('image/jpeg', 0.92)

    if (i > 0) middlePdf.addPage()

    const imgWidth = A4_WIDTH_MM
    const imgHeight = (canvas.height / canvas.width) * imgWidth
    middlePdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
  }

  const middleBytes = middlePdf.output('arraybuffer')

  const [startBytes, endBytes] = await Promise.all([
    fetchPDFBuffer(`${BASE_URL}quotation-start.pdf`),
    fetchPDFBuffer(`${BASE_URL}quotation-end.pdf`),
  ])

  const mergedPdf = await PDFDocument.create()
  const startDoc = await PDFDocument.load(startBytes, { ignoreEncryption: true })
  const endDoc = await PDFDocument.load(endBytes, { ignoreEncryption: true })
  const middleDoc = await PDFDocument.load(middleBytes)

  const [targetW, targetH] = (() => {
    const first = startDoc.getPage(0)
    return [first.getWidth(), first.getHeight()]
  })()

  const startPages = await mergedPdf.copyPages(startDoc, startDoc.getPageIndices())
  for (const page of startPages) mergedPdf.addPage(page)

  const midPages = await mergedPdf.copyPages(middleDoc, middleDoc.getPageIndices())
  for (const page of midPages) {
    page.setSize(targetW, targetH)
    mergedPdf.addPage(page)
  }

  const endPages = await mergedPdf.copyPages(endDoc, endDoc.getPageIndices())
  for (const page of endPages) mergedPdf.addPage(page)

  const mergedBytes = await mergedPdf.save()

  const safeName = (clientName || 'Quotation').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'Quotation'
  const filename = `Quotation_StudioShutterHalf - ${safeName}.pdf`

  const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
