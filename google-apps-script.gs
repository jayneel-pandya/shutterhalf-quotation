/**
 * Google Apps Script — Quotation Logger for Studio Shutter Half
 *
 * SETUP:
 * 1. Open your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/13ikuok_sfckORjVusOYlP2SS6b1GncoMK7FpmEEm0zc/edit
 * 2. Extensions > Apps Script
 * 3. Paste this entire file
 * 4. Deploy > New deployment > Web app
 *    - "Execute as: Me"
 *    - "Who has access: Anyone"
 * 5. Copy the web app URL
 * 6. Update SHEET_WEBHOOK_URL in src/utils/submitToSheet.ts
 *
 * SHEET COLUMNS (in order):
 * A: Timestamp | B: Client Name | C: Contact | D: Venue | E: Location
 * F: Event Dates | G: Services (formatted) | H: Post Production (formatted)
 * I: Package Cost | J: Raw JSON (machine-readable)
 */

const SHEET_ID = '13ikuok_sfckORjVusOYlP2SS6b1GncoMK7FpmEEm0zc'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    if (data.action === 'test') {
      return addTestRow()
    }

    if (data.action === 'list') {
      return listQuotations()
    }

    return logQuotation(data)
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 400)
  }
}

function doGet() {
  return jsonResponse({
    status: 'ok',
    message: 'Quotation Logger webhook is running',
    sheetId: SHEET_ID,
  })
}

function doOptions() {
  return jsonResponse({})
}

function logQuotation(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

  const servicesStr = (data.days || [])
    .filter((d) => d.services && d.services.length > 0)
    .map((d) => {
      const services = d.services
        .map((s) => `  \u25b6 ${s.name} (\u00d7${s.quantity})`)
        .join('\n')
      return `\u2015\u2015 ${d.label} \u2015\u2015\n${services}`
    })
    .join('\n\n')

  const postProdStr = (data.postProduction || [])
    .filter((p) => p.name)
    .map((p) => {
      let line = `\u25b6 ${p.name}`
      if (p.value !== undefined && p.value !== '' && p.value !== null) {
        line += ` ~${p.value}${p.unit ? ' ' + p.unit : ''}`
      }
      if (p.quantity > 1) {
        line += ` (\u00d7${p.quantity})`
      }
      return line
    })
    .join('\n')

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
    JSON.stringify({
      days: data.days || [],
      postProduction: data.postProduction || [],
      packageCost: data.packageCost || '',
    }),
  ])

  return jsonResponse({ success: true })
}

function listQuotations() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
  const rows = sheet.getDataRange().getValues()

  const quotations = []

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const timestamp = r[0]
    const clientName = r[1] || ''
    if (!clientName) continue

    let rawData = null
    const rawJson = r[9]
    if (rawJson) {
      try {
        rawData = JSON.parse(rawJson)
      } catch (e) {
        /* not parseable — old entry without JSON */
      }
    }

    quotations.push({
      row: i + 1,
      timestamp: timestamp ? String(timestamp) : '',
      clientName,
      contactNumber: r[2] || '',
      venue: r[3] || '',
      location: r[4] || '',
      eventDates: r[5] || '',
      rawData,
    })
  }

  return jsonResponse({ success: true, data: quotations })
}

function addTestRow() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
  sheet.appendRow([
    new Date(),
    '--- TEST ENTRY ---',
    'TEST',
    'TEST VENUE',
    'TEST LOCATION',
    'TEST DATES',
    'Test Service(x1)',
    'Test Post Production',
    '10000',
    '',
  ])
  return jsonResponse({ success: true, message: 'Test row added' })
}

function jsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
