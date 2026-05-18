import { create } from 'zustand'
import type { Day, PostProductionItem } from '../types'
import { sampleDays, samplePostProduction } from '../utils/sampleData'

let idCounter = 0
const genId = () => `id_${++idCounter}_${Math.random().toString(36).slice(2, 6)}`

interface QuotationState {
  clientName: string
  contactNumber: string
  venue: string
  location: string
  eventDates: string
  days: Day[]
  postProduction: PostProductionItem[]
  packageCost: string
  currentStep: number

  setClientName: (v: string) => void
  setContactNumber: (v: string) => void
  setVenue: (v: string) => void
  setLocation: (v: string) => void
  setEventDates: (v: string) => void
  setCurrentStep: (step: number) => void

  addDay: (label?: string) => void
  removeDay: (id: string) => void
  updateDayLabel: (id: string, label: string) => void

  toggleService: (dayId: string, serviceName: string) => void
  updateServiceQuantity: (dayId: string, serviceName: string, quantity: number) => void

  addPostProductionItem: (name: string) => void
  removePostProductionItem: (id: string) => void
  updatePostProductionItem: (id: string, name: string) => void

  setPackageCost: (cost: string) => void
  loadSampleData: () => void
  resetAll: () => void
}

function createInitialDays(): Day[] {
  return [
    { id: genId(), label: 'DAY 1', services: [] },
    { id: genId(), label: 'DAY 2', services: [] },
  ]
}

export const useQuotationStore = create<QuotationState>((set) => ({
  clientName: '',
  contactNumber: '',
  venue: '',
  location: '',
  eventDates: '',
  days: createInitialDays(),
  postProduction: [],
  packageCost: '',
  currentStep: 0,

  setClientName: (v) => set({ clientName: v }),
  setContactNumber: (v) => set({ contactNumber: v }),
  setVenue: (v) => set({ venue: v }),
  setLocation: (v) => set({ location: v }),
  setEventDates: (v) => set({ eventDates: v }),
  setCurrentStep: (step) => set({ currentStep: step }),

  addDay: (label) =>
    set((state) => ({
      days: [...state.days, { id: genId(), label: label || `Day ${state.days.length + 1}`, services: [] }],
    })),

  removeDay: (id) =>
    set((state) => ({
      days: state.days.length > 1
        ? state.days.filter((d) => d.id !== id)
        : state.days,
    })),

  updateDayLabel: (id, label) =>
    set((state) => ({
      days: state.days.map((d) => (d.id === id ? { ...d, label } : d)),
    })),

  toggleService: (dayId, serviceName) =>
    set((state) => ({
      days: state.days.map((d) => {
        if (d.id !== dayId) return d
        const exists = d.services.find((s) => s.name === serviceName)
        if (exists) {
          return { ...d, services: d.services.filter((s) => s.name !== serviceName) }
        }
        return { ...d, services: [...d.services, { name: serviceName, quantity: 1 }] }
      }),
    })),

  updateServiceQuantity: (dayId, serviceName, quantity) =>
    set((state) => ({
      days: state.days.map((d) => {
        if (d.id !== dayId) return d
        return {
          ...d,
          services: d.services.map((s) =>
            s.name === serviceName ? { ...s, quantity: Math.max(1, quantity) } : s
          ),
        }
      }),
    })),

  addPostProductionItem: (name) =>
    set((state) => ({
      postProduction: [...state.postProduction, { id: genId(), name }],
    })),

  removePostProductionItem: (id) =>
    set((state) => ({
      postProduction: state.postProduction.filter((p) => p.id !== id),
    })),

  updatePostProductionItem: (id, name) =>
    set((state) => ({
      postProduction: state.postProduction.map((p) =>
        p.id === id ? { ...p, name } : p
      ),
    })),

  setPackageCost: (cost) => set({ packageCost: cost }),

  loadSampleData: () =>
    set({
      clientName: 'Siddharth Nair',
      contactNumber: '+61426913249',
      venue: 'Ananta',
      location: 'Rajkot & Ahmedabad',
      eventDates: '21,22,23 Feb 2026',
      days: sampleDays.map((d) => ({ ...d, id: genId() })),
      postProduction: samplePostProduction.map((p) => ({ ...p, id: genId() })),
      packageCost: '₹3,15,000/-',
    }),

  resetAll: () =>
    set({
      clientName: '',
      contactNumber: '',
      venue: '',
      location: '',
      eventDates: '',
      days: createInitialDays(),
      postProduction: [],
      packageCost: '',
      currentStep: 0,
    }),
}))
