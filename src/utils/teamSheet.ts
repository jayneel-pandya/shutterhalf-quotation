import type { TeamMember, TeamAssignment, ConflictInfo, ApprovedClient } from '../types'

const SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxRbv7LzMFCDOoFwo9kegyPxATq2l_zeBsPYg_LuqAt4iqcbJS9LcpcnXBQbMmTirQgRg/exec'

async function post(data: Record<string, unknown>) {
  const res = await fetch(SHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Sheet server returned ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'Sheet server error')
  return json
}

export async function getApprovedClients(): Promise<ApprovedClient[]> {
  const json = await post({ action: 'getApprovedClients' })
  return json.data as ApprovedClient[]
}

export async function approveClient(row: number, status: string): Promise<void> {
  await post({ action: 'approveClient', row, status })
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const json = await post({ action: 'getTeamMembers' })
  return json.data as TeamMember[]
}

export async function getTeamMembersByRole(role: string): Promise<TeamMember[]> {
  const json = await post({ action: 'getTeamMembersByRole', role })
  return json.data as TeamMember[]
}

export async function addTeamMember(data: Omit<TeamMember, 'id'>): Promise<{ id: number }> {
  const json = await post({ action: 'addTeamMember', ...data })
  return { id: json.id }
}

export async function updateTeamMember(data: TeamMember): Promise<void> {
  await post({ action: 'updateTeamMember', ...data })
}

export async function deleteTeamMember(id: number): Promise<void> {
  await post({ action: 'deleteTeamMember', id })
}

export interface SaveAssignmentData {
  clientName: string
  dayLabel: string
  role: string
  quantityNeeded: number
  assignedMembers: string[]
  status?: string
  forceAssigned?: boolean
}

export async function saveAssignment(data: SaveAssignmentData): Promise<void> {
  await post({ action: 'saveAssignment', ...data })
}

export async function getAssignments(clientName?: string): Promise<TeamAssignment[]> {
  const json = await post({ action: 'getAssignments', ...(clientName ? { clientName } : {}) })
  return json.data as TeamAssignment[]
}

export async function checkConflict(personName: string, dayLabel: string, excludeClient?: string): Promise<ConflictInfo[]> {
  const json = await post({ action: 'checkConflict', personName, dayLabel, ...(excludeClient ? { excludeClient } : {}) })
  return json.data as ConflictInfo[]
}

export async function deleteAssignment(id: number): Promise<void> {
  await post({ action: 'deleteAssignment', id })
}

export interface TeamData {
  members: TeamMember[]
  assignments: TeamAssignment[]
  approvedClients: ApprovedClient[]
}

export async function getAllTeamData(): Promise<TeamData> {
  const json = await post({ action: 'getAllTeamData' })
  return json.data as TeamData
}

export async function batchSaveAssignments(assignments: SaveAssignmentData[]): Promise<void> {
  await post({ action: 'batchSaveAssignments', assignments })
}
