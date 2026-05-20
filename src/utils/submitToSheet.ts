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

const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwRys-kG1TTNJz3HE8Zx3--4qT7QYlBVBGQYcS5dNa4TJTGKqk0n9FtN7qit_Z0LQ6i/exec'

export async function submitToSheet(data: SheetPayload): Promise<void> {
  try {
    await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    })
  } catch {
    // Silently fail — sheet logging is non-critical
  }
}
