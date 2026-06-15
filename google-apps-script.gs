/**
 * Google Apps Script — Quotation Logger + Team Management for Studio Shutter Half
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
 * 6. Update SHEET_WEBHOOK_URL in src/utils/submitToSheet.ts and src/utils/teamSheet.ts
 *
 * SHEETS:
 * - Quotations: A=Timestamp, B=Client Name, C=Contact, D=Venue, E=Location,
 *   F=Event Dates, G=Services, H=Post Production, I=Package Cost, J=(empty),
 *   K=Approval Status, ..., Z=Raw JSON
 * - TeamMembers: A=ID, B=Name, C=Role, D=Phone, E=Notes
 * - Assignments: A=ID, B=Client Name, C=Day Label, D=Role, E=Qty Needed,
 *   F=Assigned Members (CSV), G=Status, H=Force-Assigned, I=Timestamp
 */

const SHEET_ID = '13ikuok_sfckORjVusOYlP2SS6b1GncoMK7FpmEEm0zc'

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  let sheet = ss.getSheetByName(name)
  if (!sheet) {
    sheet = ss.insertSheet(name)
  }
  return sheet
}

function ensureTeamMembersHeaders() {
  const sheet = getOrCreateSheet('TeamMembers')
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Name', 'Role', 'Phone', 'Notes', 'Status'])
    sheet.appendRow([1, 'Rajesh Sharma', 'Cinematographer', '9876543210', 'Lead cinematographer, 8 yrs exp', 'Active'])
    sheet.appendRow([2, 'Vikram Patel', 'Candid Photographer', '9876543211', 'Specializes in candid wedding shots', 'Active'])
    sheet.appendRow([3, 'Suresh Yadav', 'Ritual Photographer', '9876543212', 'Ritual photography expert', 'Active'])
    sheet.appendRow([4, 'Amit Singh', 'Ritual Photographer', '9876543213', 'Also does cinematography backup', 'Active'])
    sheet.appendRow([5, 'Deepak Verma', 'Drone', '9876543214', 'Drone pilot, also FPV certified', 'Active'])
  }
}

function ensureAssignmentsHeaders() {
  const sheet = getOrCreateSheet('Assignments')
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Client Name', 'Day Label', 'Role', 'Qty Needed', 'Assigned Members', 'Status', 'Force-Assigned', 'Timestamp'])
  }
}

function ensureQuotationsApprovalColumn() {
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  if (headerRow.length < 11 || headerRow[10] !== 'Approval Status') {
    sheet.getRange(1, 11).setValue('Approval Status')
    if (sheet.getLastRow() > 1) {
      const range = sheet.getRange(2, 11, sheet.getLastRow() - 1)
      range.setValue('Pending')
    }
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action

    if (action === 'test') return addTestRow()
    if (action === 'list') return listQuotations()
    if (action === 'approveClient') return approveClient(data)
    if (action === 'getApprovedClients') return getApprovedClients()
    if (action === 'getTeamMembers') return getTeamMembers_()
    if (action === 'getTeamMembersByRole') return getTeamMembersByRole(data)
    if (action === 'addTeamMember') return addTeamMember_(data)
    if (action === 'updateTeamMember') return updateTeamMember_(data)
    if (action === 'deleteTeamMember') return deleteTeamMember_(data)
    if (action === 'saveAssignment') return saveAssignment(data)
    if (action === 'getAssignments') return getAssignments(data)
    if (action === 'checkConflict') return checkConflict(data)
    if (action === 'deleteAssignment') return deleteAssignment(data)
    if (action === 'getAllTeamData') return getAllTeamData()
    if (action === 'batchSaveAssignments') return batchSaveAssignments(data)

    return logQuotation(data)
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 400)
  }
}

function doGet() {
  return jsonResponse({
    status: 'ok',
    message: 'Quotation Logger + Team Management webhook is running',
    sheetId: SHEET_ID,
  })
}

function doOptions() {
  return jsonResponse({})
}

// ─── QUOTATIONS ────────────────────────────────────────────────

function logQuotation(data) {
  ensureQuotationsApprovalColumn()
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const changed = data.changedSections || {}

  let servicesStr = (data.days || [])
    .filter((d) => d.services && d.services.length > 0)
    .map((d) => {
      const services = d.services
        .map((s) => `  \u25b6 ${s.name} (\u00d7${s.quantity})`)
        .join('\n')
      return `\u2015\u2015 ${d.label} \u2015\u2015\n${services}`
    })
    .join('\n\n')

  if (changed.services && servicesStr) {
    servicesStr = '\u2726 EDITED\n' + servicesStr
  }

  let postProdStr = (data.postProduction || [])
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

  if (changed.postProduction && postProdStr) {
    postProdStr = '\u2726 EDITED\n' + postProdStr
  }

  let packageCost = data.packageCost || ''
  if (changed.packageCost && packageCost) {
    packageCost += ' \u2726 EDITED'
  }

  const rawPayload = {
    days: data.days || [],
    postProduction: data.postProduction || [],
    packageCost: data.packageCost || '',
  }

  if (changed.services || changed.postProduction || changed.packageCost) {
    rawPayload.changedSections = changed
  }

  const row = new Array(26).fill('')
  row[0] = new Date()
  row[1] = data.clientName || ''
  row[2] = data.contactNumber || ''
  row[3] = data.venue || ''
  row[4] = data.location || ''
  row[5] = data.eventDates || ''
  row[6] = servicesStr
  row[7] = postProdStr
  row[8] = packageCost
  row[10] = 'Pending'
  row[25] = JSON.stringify(rawPayload)
  sheet.appendRow(row)

  return jsonResponse({ success: true })
}

function listQuotations() {
  ensureQuotationsApprovalColumn()
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const rows = sheet.getDataRange().getValues()

  const quotations = []

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const timestamp = r[0]
    const clientName = r[1] || ''
    if (!clientName) continue

    let rawData = null
    const rawJson = r[25]
    if (rawJson) {
      try {
        rawData = JSON.parse(rawJson)
      } catch (e) {
        /* not parseable */
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
      approvalStatus: r[10] || 'Pending',
      rawData,
    })
  }

  return jsonResponse({ success: true, data: quotations })
}

function approveClient(data) {
  ensureQuotationsApprovalColumn()
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const row = data.row
  const status = data.status

  if (!row || !status) {
    return jsonResponse({ success: false, error: 'row and status required' })
  }

  sheet.getRange(row, 11).setValue(status)
  return jsonResponse({ success: true })
}

function getApprovedClients() {
  ensureQuotationsApprovalColumn()
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const rows = sheet.getDataRange().getValues()

  const clients = []

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const clientName = r[1] || ''
    const approvalStatus = r[10] || 'Pending'
    if (!clientName || approvalStatus !== 'Approved') continue

    let rawData = null
    const rawJson = r[25]
    if (rawJson) {
      try {
        rawData = JSON.parse(rawJson)
      } catch (e) {}
    }

    clients.push({
      row: i + 1,
      clientName,
      contactNumber: r[2] || '',
      venue: r[3] || '',
      location: r[4] || '',
      eventDates: r[5] || '',
      rawData,
    })
  }

  return jsonResponse({ success: true, data: clients })
}

function addTestRow() {
  ensureQuotationsApprovalColumn()
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const testRow = new Array(26).fill('')
  testRow[0] = new Date()
  testRow[1] = '--- TEST ENTRY ---'
  testRow[2] = 'TEST'
  testRow[3] = 'TEST VENUE'
  testRow[4] = 'TEST LOCATION'
  testRow[5] = 'TEST DATES'
  testRow[6] = 'Test Service(x1)'
  testRow[7] = 'Test Post Production'
  testRow[8] = '10000'
  testRow[10] = 'Pending'
  sheet.appendRow(testRow)
  return jsonResponse({ success: true, message: 'Test row added' })
}

// ─── TEAM MEMBERS ──────────────────────────────────────────────

function readTeamMembers_() {
  ensureTeamMembersHeaders()
  const sheet = getOrCreateSheet('TeamMembers')
  const rows = sheet.getDataRange().getValues()

  const members = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    members.push({
      id: r[0],
      name: r[1] || '',
      role: r[2] || '',
      phone: r[3] || '',
      notes: r[4] || '',
      status: r[5] || 'Active',
    })
  }
  return members
}

function getTeamMembers_() {
  const members = readTeamMembers_()
  return jsonResponse({ success: true, data: members })
}

function getTeamMembersByRole(data) {
  const role = data.role
  if (!role) return jsonResponse({ success: false, error: 'role required' })

  const all = readTeamMembers_()
  const filtered = all.filter((m) => m.role.toLowerCase() === role.toLowerCase() && m.status === 'Active')

  return jsonResponse({ success: true, data: filtered })
}

function addTeamMember_(data) {
  ensureTeamMembersHeaders()
  const sheet = getOrCreateSheet('TeamMembers')
  const rows = sheet.getDataRange().getValues()

  let maxId = 0
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] > maxId) maxId = rows[i][0]
  }

  const newId = maxId + 1
  sheet.appendRow([newId, data.name || '', data.role || '', data.phone || '', data.notes || '', data.status || 'Active'])

  return jsonResponse({ success: true, id: newId })
}

function updateTeamMember_(data) {
  ensureTeamMembersHeaders()
  const sheet = getOrCreateSheet('TeamMembers')
  const rows = sheet.getDataRange().getValues()

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      const rowNum = i + 1
      if (data.name !== undefined) sheet.getRange(rowNum, 2).setValue(data.name)
      if (data.role !== undefined) sheet.getRange(rowNum, 3).setValue(data.role)
      if (data.phone !== undefined) sheet.getRange(rowNum, 4).setValue(data.phone)
      if (data.notes !== undefined) sheet.getRange(rowNum, 5).setValue(data.notes)
      if (data.status !== undefined) sheet.getRange(rowNum, 6).setValue(data.status)
      return jsonResponse({ success: true })
    }
  }

  return jsonResponse({ success: false, error: 'Member not found' })
}

function deleteTeamMember_(data) {
  ensureTeamMembersHeaders()
  const sheet = getOrCreateSheet('TeamMembers')
  const rows = sheet.getDataRange().getValues()

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 1)
      return jsonResponse({ success: true })
    }
  }

  return jsonResponse({ success: false, error: 'Member not found' })
}

// ─── ASSIGNMENTS ───────────────────────────────────────────────

function saveAssignment(data) {
  ensureAssignmentsHeaders()
  const sheet = getOrCreateSheet('Assignments')
  const rows = sheet.getDataRange().getValues()

  const assignedMembers = Array.isArray(data.assignedMembers)
    ? data.assignedMembers.join(', ')
    : (data.assignedMembers || '')

  // Check if assignment already exists for this client + day + role
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (
      String(r[1]) === String(data.clientName) &&
      String(r[2]) === String(data.dayLabel) &&
      String(r[3]) === String(data.role)
    ) {
      const rowNum = i + 1
      sheet.getRange(rowNum, 5).setValue(data.quantityNeeded || r[4])
      sheet.getRange(rowNum, 6).setValue(assignedMembers)
      sheet.getRange(rowNum, 7).setValue(data.status || r[6] || 'Active')
      sheet.getRange(rowNum, 8).setValue(data.forceAssigned ? 'Yes' : (r[7] || 'No'))
      sheet.getRange(rowNum, 9).setValue(new Date())
      markConflicts_(sheet, data.forceAssigned, assignedMembers, data.dayLabel, data.clientName)
      return jsonResponse({ success: true, updated: true })
    }
  }

  // New assignment
  let maxId = 0
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] > maxId) maxId = rows[i][0]
  }

  sheet.appendRow([
    maxId + 1,
    data.clientName || '',
    data.dayLabel || '',
    data.role || '',
    data.quantityNeeded || 1,
    assignedMembers,
    data.status || 'Active',
    data.forceAssigned ? 'Yes' : 'No',
    new Date(),
  ])

  markConflicts_(sheet, data.forceAssigned, assignedMembers, data.dayLabel, data.clientName)

  return jsonResponse({ success: true, updated: false })
}

function markConflicts_(sheet, forceAssigned, assignedMembersCsv, dayLabel, clientName) {
  if (!forceAssigned || !assignedMembersCsv) return

  const names = assignedMembersCsv.split(', ').filter(Boolean)
  if (names.length === 0) return

  const rows = sheet.getDataRange().getValues()
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const existingClient = String(r[1] || '')
    const existingMembers = String(r[5] || '')
    const existingStatus = String(r[6] || 'Active')

    if (existingClient === clientName) continue
    if (String(r[2]) !== dayLabel) continue
    if (existingStatus !== 'Active') continue

    for (const name of names) {
      if (existingMembers.indexOf(name) !== -1) {
        sheet.getRange(i + 1, 7).setValue('Conflict')
        break
      }
    }
  }
}

function getAssignments(data) {
  ensureAssignmentsHeaders()
  const sheet = getOrCreateSheet('Assignments')
  const rows = sheet.getDataRange().getValues()

  const assignments = []
  const clientFilter = data && data.clientName

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const clientName = r[1] || ''
    if (clientFilter && clientName !== clientFilter) continue

    assignments.push({
      id: r[0],
      clientName,
      dayLabel: r[2] || '',
      role: r[3] || '',
      quantityNeeded: r[4] || 1,
      assignedMembers: r[5] ? String(r[5]).split(', ').filter(Boolean) : [],
      status: r[6] || 'Active',
      forceAssigned: r[7] === 'Yes',
      timestamp: r[8] ? String(r[8]) : '',
    })
  }

  return jsonResponse({ success: true, data: assignments })
}

function checkConflict(data) {
  const personName = data.personName
  const dayLabel = data.dayLabel
  const excludeClient = data.excludeClient || ''

  if (!personName || !dayLabel) {
    return jsonResponse({ success: false, error: 'personName and dayLabel required' })
  }

  ensureAssignmentsHeaders()
  const sheet = getOrCreateSheet('Assignments')
  const rows = sheet.getDataRange().getValues()

  const conflicts = []

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const assignedMembers = r[5] ? String(r[5]).split(', ').filter(Boolean) : []
    const clientName = r[1] || ''
    const status = r[6] || 'Active'

    if (clientName === excludeClient) continue
    if (String(r[2]) !== dayLabel) continue
    if (status !== 'Active') continue

    if (assignedMembers.indexOf(personName) !== -1) {
      conflicts.push({
        personName,
        existingClient: clientName,
        existingDay: String(r[2] || ''),
        existingRole: String(r[3] || ''),
      })
    }
  }

  return jsonResponse({ success: true, data: conflicts })
}

function deleteAssignment(data) {
  ensureAssignmentsHeaders()
  const sheet = getOrCreateSheet('Assignments')
  const rows = sheet.getDataRange().getValues()

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.deleteRow(i + 1)
      return jsonResponse({ success: true })
    }
  }

  return jsonResponse({ success: false, error: 'Assignment not found' })
}

// ─── BATCH ENDPOINTS ───────────────────────────────────────────

function getAllTeamData() {
  const members = readTeamMembers_()
  const assignments = readAllAssignments_()
  const approvedClients = readApprovedClients_()
  return jsonResponse({ success: true, data: { members, assignments, approvedClients } })
}

function readAllAssignments_() {
  ensureAssignmentsHeaders()
  const sheet = getOrCreateSheet('Assignments')
  const rows = sheet.getDataRange().getValues()

  const assignments = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    assignments.push({
      id: r[0],
      clientName: r[1] || '',
      dayLabel: r[2] || '',
      role: r[3] || '',
      quantityNeeded: r[4] || 1,
      assignedMembers: r[5] ? String(r[5]).split(', ').filter(Boolean) : [],
      status: r[6] || 'Active',
      forceAssigned: r[7] === 'Yes',
      timestamp: r[8] ? String(r[8]) : '',
    })
  }
  return assignments
}

function readApprovedClients_() {
  ensureQuotationsApprovalColumn()
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('Quotations') || ss.getActiveSheet()
  const rows = sheet.getDataRange().getValues()

  const clients = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const clientName = r[1] || ''
    const approvalStatus = r[10] || 'Pending'
    if (!clientName || approvalStatus !== 'Approved') continue

    let rawData = null
    const rawJson = r[25]
    if (rawJson) {
      try { rawData = JSON.parse(rawJson) } catch (e) {}
    }

    clients.push({
      row: i + 1,
      clientName,
      contactNumber: r[2] || '',
      venue: r[3] || '',
      location: r[4] || '',
      eventDates: r[5] || '',
      rawData,
    })
  }
  return clients
}

function batchSaveAssignments(data) {
  ensureAssignmentsHeaders()
  const sheet = getOrCreateSheet('Assignments')
  const incoming = data.assignments || []

  // Keep header row, clear all data rows
  const lastRow = sheet.getLastRow()
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1)
  }

  let maxId = 0
  for (let i = 0; i < incoming.length; i++) {
    const a = incoming[i]
    const assignedMembers = Array.isArray(a.assignedMembers)
      ? a.assignedMembers.join(', ')
      : (a.assignedMembers || '')
    const newId = maxId + 1 + i

    sheet.appendRow([
      newId,
      a.clientName || '',
      a.dayLabel || '',
      a.role || '',
      a.quantityNeeded || 1,
      assignedMembers,
      a.status || 'Active',
      a.forceAssigned ? 'Yes' : 'No',
      new Date(),
    ])
  }

  // Mark conflicts: for force-assigned entries, mark other overlapping assignments as Conflict
  for (let i = 0; i < incoming.length; i++) {
    const a = incoming[i]
    if (!a.forceAssigned || !Array.isArray(a.assignedMembers)) continue
    if (a.assignedMembers.length === 0) continue

    const rows = sheet.getDataRange().getValues()
    for (let j = 1; j < rows.length; j++) {
      const r = rows[j]
      if (String(r[1]) === String(a.clientName)) continue
      if (String(r[2]) !== String(a.dayLabel)) continue
      if (String(r[6]) !== 'Active') continue

      const existingMembers = String(r[5] || '').split(', ').filter(Boolean)
      for (const name of a.assignedMembers) {
        if (existingMembers.indexOf(name) !== -1) {
          sheet.getRange(j + 1, 7).setValue('Conflict')
          break
        }
      }
    }
  }

  return jsonResponse({ success: true, count: incoming.length })
}

// ─── HELPERS ───────────────────────────────────────────────────

function jsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
