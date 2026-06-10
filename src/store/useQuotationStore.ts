import { create } from 'zustand'
import type { Day, PostProductionItem } from '../types'
import { AVAILABLE_SERVICES, AVAILABLE_POST_PRODUCTION } from '../constants/services'

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
  setDays: (days: Day[]) => void
  setPostProduction: (items: PostProductionItem[]) => void

  addDay: (label?: string) => void
  removeDay: (id: string) => void
  updateDayLabel: (id: string, label: string) => void

  toggleService: (dayId: string, serviceName: string) => void
  updateServiceQuantity: (dayId: string, serviceName: string, quantity: number) => void

  togglePostProduction: (name: string) => void
  updatePostProductionValue: (name: string, value: string) => void
  updatePostProductionQuantity: (name: string, quantity: number) => void

  setPackageCost: (cost: string) => void
  resetAll: () => void
}

export const useQuotationStore = create<QuotationState>((set) => ({
  clientName: '',
  contactNumber: '',
  venue: '',
  location: '',
  eventDates: '',
  days: [],
  postProduction: [],
  packageCost: '',
  currentStep: 0,

  setClientName: (v) => set({ clientName: v }),
  setContactNumber: (v) => set({ contactNumber: v.replace(/[^\d+]/g, '').replace(/^(\+{2,})/, '+') }),
  setVenue: (v) => set({ venue: v }),
  setLocation: (v) => set({ location: v }),
  setEventDates: (v) => set({ eventDates: v }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setDays: (days) => set({ days }),
  setPostProduction: (postProduction) => set({ postProduction }),

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
        const category = AVAILABLE_SERVICES.find((s) => s.name === serviceName)?.category || ''
        return { ...d, services: [...d.services, { name: serviceName, quantity: 1, category }] }
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

  togglePostProduction: (name) =>
    set((state) => {
      const exists = state.postProduction.find((p) => p.name === name)
      if (exists) {
        return { postProduction: state.postProduction.filter((p) => p.name !== name) }
      }
      const found = AVAILABLE_POST_PRODUCTION.find((a) => a.name === name)
      return {
        postProduction: [
          ...state.postProduction,
          { name, spec: found?.spec || '', unit: found?.unit || '', value: '', quantity: 1 },
        ],
      }
    }),

  updatePostProductionValue: (name, value) =>
    set((state) => ({
      postProduction: state.postProduction.map((p) =>
        p.name === name ? { ...p, value } : p
      ),
    })),

  updatePostProductionQuantity: (name, quantity) =>
    set((state) => ({
      postProduction: state.postProduction.map((p) =>
        p.name === name ? { ...p, quantity: Math.max(1, quantity) } : p
      ),
    })),

  setPackageCost: (cost) => set({ packageCost: cost }),

  resetAll: () =>
    set({
      clientName: '',
      contactNumber: '',
      venue: '',
      location: '',
      eventDates: '',
      days: [],
      postProduction: [],
      packageCost: '',
      currentStep: 0,
    }),
}))
