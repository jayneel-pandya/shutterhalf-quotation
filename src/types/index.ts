export interface Service {
  name: string
  quantity: number
}

export interface Day {
  id: string
  label: string
  services: Service[]
}

export interface PostProductionItem {
  id: string
  name: string
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
