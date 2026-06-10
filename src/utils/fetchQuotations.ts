import type { Day, PostProductionItem } from '../types'

const SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbynYOa70wa5pFgvRo5ZM3t5ipD9DyNIRlDF_TAESD4yDAqrdBS_JlTPvcOVYr9BcfLgjQ/exec'

export interface QuotationRow {
  row: number
  timestamp: string
  clientName: string
  contactNumber: string
  venue: string
  location: string
  eventDates: string
  rawData: {
    days: Day[]
    postProduction: PostProductionItem[]
    packageCost: string
  } | null
}

export async function fetchQuotations(): Promise<QuotationRow[]> {
  const res = await fetch(SHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'list' }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch quotations: ${res.status}`)
  }

  const json = await res.json()

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error('Invalid response from sheet webhook')
  }

  return json.data as QuotationRow[]
}
