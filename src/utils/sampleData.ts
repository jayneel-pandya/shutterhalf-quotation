import type { Day, PostProductionItem } from '../types'
import { AVAILABLE_POST_PRODUCTION } from '../constants/services'

let idCounter = 0
const genId = () => `samp_${++idCounter}_${Math.random().toString(36).slice(2, 6)}`

export const sampleDays: Day[] = [
  {
    id: genId(),
    label: 'DAY 1',
    services: [
      { name: 'Cinematographer', quantity: 1 },
      { name: 'Candid Photographer', quantity: 1 },
      { name: 'Ritual Photographer', quantity: 1 },
      { name: 'Ritual Videographer', quantity: 1 },
      { name: 'Drone', quantity: 1 },
      { name: 'Live Setup', quantity: 1 },
    ],
  },
  {
    id: genId(),
    label: 'DAY 2',
    services: [
      { name: 'Cinematographer', quantity: 1 },
      { name: 'Candid Photographer', quantity: 1 },
      { name: 'Ritual Photographer', quantity: 1 },
      { name: 'Ritual Videographer', quantity: 1 },
      { name: 'Drone', quantity: 1 },
    ],
  },
  {
    id: genId(),
    label: 'DAY 3',
    services: [
      { name: 'Cinematographer', quantity: 1 },
      { name: 'Candid Photographer', quantity: 1 },
      { name: 'Ritual Photographer', quantity: 1 },
      { name: 'Ritual Videographer', quantity: 1 },
    ],
  },
]

export const samplePostProduction: PostProductionItem[] = AVAILABLE_POST_PRODUCTION.map((pp) => ({
  name: pp.name,
  spec: pp.spec,
  unit: pp.unit,
  value: 0,
}))
