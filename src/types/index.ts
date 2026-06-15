export interface Service {
  name: string
  quantity: number
  category: string
}

export interface Day {
  id: string
  label: string
  services: Service[]
}

export interface PostProductionItem {
  name: string
  spec: string
  unit: string
  value: string
  quantity: number
}

export interface AvailablePostProduction {
  name: string
  spec: string
  unit: string
}

export interface QuotationData {
  clientName: string
  contactNumber: string
  venue: string
  location: string
  eventDates: string
  days: Day[]
  postProduction: PostProductionItem[]
  packageCost: string
}

export interface AvailableService {
  name: string
  category: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  phone: string
  notes: string
  status: 'Active' | 'Inactive'
}

export interface TeamAssignment {
  id: number
  clientName: string
  dayLabel: string
  role: string
  quantityNeeded: number
  assignedMembers: string[]
  status: 'Active' | 'Conflict'
  forceAssigned: boolean
  timestamp: string
}

export interface ConflictInfo {
  personName: string
  existingClient: string
  existingDay: string
  existingRole: string
}

export interface ApprovedClient {
  row: number
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
