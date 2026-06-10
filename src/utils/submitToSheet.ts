import type { Day, PostProductionItem } from '../types'

export interface ChangedSections {
  services: boolean
  postProduction: boolean
  packageCost: boolean
}

export interface SheetPayload {
  clientName: string
  contactNumber: string
  venue: string
  location: string
  eventDates: string
  days: Day[]
  postProduction: PostProductionItem[]
  packageCost: string
  changedSections?: ChangedSections
}

const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwRtWlFLGzWzx6RMtbWrEjG_STayQ1-b5Ie-R5f3hEvIUgUmk_QBBfpHXFjmWp1fzYVrg/exec'

function sanitizePayload(data: SheetPayload): SheetPayload {
  return {
    ...data,
    contactNumber: data.contactNumber.replace(/[^\d+]/g, '').replace(/^(\+{2,})/, '+'),
  }
}

export async function submitToSheet(data: SheetPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(sanitizePayload(data)),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const msg = `Sheet server returned ${res.status}: ${res.statusText}${text ? ` — ${text}` : ''}`
      console.warn('[Sheet] ' + msg)
      return { success: false, error: msg }
    }

    const result = await res.json()
    if (!result.success) {
      const msg = result.error || 'Sheet server returned an error'
      console.warn('[Sheet] ' + msg)
      return { success: false, error: msg }
    }

    console.log('[Sheet] Quotation logged successfully:', result)
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Sheet] Failed to log quotation:', err)
    return { success: false, error: msg }
  }
}
