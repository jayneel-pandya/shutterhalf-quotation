import type { RefObject } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { PDFDocument } from 'pdf-lib'

const A4_WIDTH_MM = 210
const CANVAS_SCALE = 2
const BASE = '/studioshutterhalf'

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

export async function generatePDF(previewRef: RefObject<HTMLDivElement | null>): Promise<void> {
  const container = previewRef.current
  if (!container) return

  const allPages = container.querySelectorAll<HTMLElement>('[data-preview-page]')
  if (allPages.length < 3) return

  const middleElements = Array.from(allPages)

  // ----- Generate middle pages PDF via jsPDF -----
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

  // ----- Merge start + middle + end PDFs using pdf-lib -----
  const [startBytes, endBytes] = await Promise.all([
    fetchPDFBuffer(`${BASE}/quotation-start.pdf`),
    fetchPDFBuffer(`${BASE}/quotation-end.pdf`),
  ])

  const mergedPdf = await PDFDocument.create()
  const startDoc = await PDFDocument.load(startBytes, { ignoreEncryption: true })
  const endDoc = await PDFDocument.load(endBytes, { ignoreEncryption: true })
  const middleDoc = await PDFDocument.load(middleBytes)

  const startPages = await mergedPdf.copyPages(startDoc, startDoc.getPageIndices())
  for (const page of startPages) mergedPdf.addPage(page)

  const midPages = await mergedPdf.copyPages(middleDoc, middleDoc.getPageIndices())
  for (const page of midPages) mergedPdf.addPage(page)

  const endPages = await mergedPdf.copyPages(endDoc, endDoc.getPageIndices())
  for (const page of endPages) mergedPdf.addPage(page)

  const mergedBytes = await mergedPdf.save()

  // ----- Download -----
  const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Quotation_StudioShutterHalf.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
