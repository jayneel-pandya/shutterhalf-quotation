/**
 * Google Apps Script — Quotation Logger
 *
 * SETUP:
 * 1. Open your Google Sheet
 * 2. Extensions > Apps Script
 * 3. Paste this entire file
 * 4. Deploy > New deployment > Web app
 * 5. "Execute as: Me", "Who has access: Anyone"
 * 6. Copy the web app URL
 * 7. Update SHEET_WEBHOOK_URL in src/utils/submitToSheet.ts
 *
 * SHEET COLUMNS (in order):
 * A: Timestamp | B: Client Name | C: Contact | D: Venue | E: Location
 * F: Event Dates | G: Services (per day) | H: Post Production | I: Package Cost
 */

function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = SpreadsheetApp.openById('13ikuok_sfckORjVusOYlP2SS6b1GncoMK7FpmEEm0zc').getActiveSheet()

    if (data.action === 'test') {
      sheet.appendRow([new Date(), '--- TEST ENTRY ---', '', '', '', '', '', '', ''])
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Test row added' }))
        .setMimeType(ContentService.MimeType.JSON)
    }

    const servicesStr = (data.days || [])
      .map((d) => `${d.label}: ${(d.services || []).map((s) => `${s.name}(x${s.quantity})`).join(', ')}`)
      .join(' | ')

    const postProdStr = (data.postProduction || [])
      .map((p) => `${p.name}${p.value > 0 ? ` ~${p.value} ${p.unit}` : ''}`)
      .join(', ')

    sheet.appendRow([
      new Date(),
      data.clientName || '',
      data.contactNumber || '',
      data.venue || '',
      data.location || '',
      data.eventDates || '',
      servicesStr,
      postProdStr,
      data.packageCost || '',
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Quotation Logger webhook is running' }))
    .setMimeType(ContentService.MimeType.JSON)
}

function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
}
