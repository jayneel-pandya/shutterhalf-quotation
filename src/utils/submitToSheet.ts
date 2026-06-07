import type { Day, PostProductionItem } from '../types'

export interface SheetPayload {
  clientName: string
  contactNumber: string
  venue: string
  location: string
  eventDates: string
  days: Day[]
  postProduction: PostProductionItem[]
  packageCost: string
}

const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwi9Pr89jFmDIcEuJpRP41hhTHmIZN3uGBkSSBdAPokVhZ4hVuTrcPKAgDSgjCjokuvRw/exec'

function sanitizePayload(data: SheetPayload): SheetPayload {
  return {
    ...data,
    contactNumber: data.contactNumber.replace(/[^\d+]/g, '').replace(/^(\+{2,})/, '+'),
  }
}

export async function submitToSheet(data: SheetPayload): Promise<{ success: boolean }> {
  try {
    const res = await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(sanitizePayload(data)),
    })

    if (!res.ok) {
      console.warn(`[Sheet] Server returned ${res.status}: ${res.statusText}`)
      return { success: false }
    }

    const result = await res.json()
    console.log('[Sheet] Quotation logged successfully:', result)
    return { success: true }
  } catch (err) {
    console.error('[Sheet] Failed to log quotation:', err)
    return { success: false }
  }
}
