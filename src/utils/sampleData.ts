import type { Day, PostProductionItem } from '../types'

const generateId = () => Math.random().toString(36).substring(2, 9)

export const sampleDays: Day[] = [
  {
    id: generateId(),
    label: 'DAY 1',
    services: [
      { name: 'Cinematographer', quantity: 1 },
      { name: 'Candid Photographer', quantity: 1 },
      { name: 'Family Photographer', quantity: 1 },
      { name: 'Ritual Photographer', quantity: 1 },
      { name: 'Ritual Videographer', quantity: 1 },
      { name: 'Drone', quantity: 1 },
    ],
  },
  {
    id: generateId(),
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
    id: generateId(),
    label: 'DAY 3',
    services: [
      { name: 'Cinematographer', quantity: 1 },
      { name: 'Candid Photographer', quantity: 1 },
      { name: 'Ritual Photographer', quantity: 1 },
      { name: 'Ritual Videographer', quantity: 1 },
    ],
  },
]

export const samplePostProduction: PostProductionItem[] = [
  { id: generateId(), name: '1 Cinematic Teaser' },
  { id: generateId(), name: '1 Cinematic Highlight' },
  { id: generateId(), name: 'Teaser 40 to 50 seconds' },
  { id: generateId(), name: 'Highlight 4 to 5 Minutes' },
  { id: generateId(), name: '1 Ritual Video' },
  { id: generateId(), name: '15/20 Minutes' },
  { id: generateId(), name: '1 Short Film' },
  { id: generateId(), name: 'Edited Photos' },
  { id: generateId(), name: '1 Wedding Magazine (Small Complimentary)' },
  { id: generateId(), name: 'Album 2 x 12*30 (30 Sheets Per Album)' },
]
