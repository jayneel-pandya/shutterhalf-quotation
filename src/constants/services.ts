import type { AvailableService, AvailablePostProduction } from '../types'

export const AVAILABLE_SERVICES: AvailableService[] = [
  { name: 'Cinematographer', category: 'Video' },
  { name: 'Candid Photographer', category: 'Photo' },
  { name: 'Ritual Photographer', category: 'Photo' },
  { name: 'Ritual Videographer', category: 'Video' },
  { name: 'Drone', category: 'Equipment' },
  { name: 'Live Setup', category: 'Equipment' },
  { name: 'FPV Drone', category: 'Equipment' },
]

export const AVAILABLE_POST_PRODUCTION: AvailablePostProduction[] = [
  { name: 'Insta Reels', spec: '30/40 seconds', unit: 'seconds' },
  { name: 'Cinematic Teaser', spec: '50 seconds', unit: 'seconds' },
  { name: 'Cinematic Highlight', spec: '5/6 minutes', unit: 'minutes' },
  { name: 'Cinematic Short Film', spec: '15/20 minutes', unit: 'minutes' },
  { name: 'Traditional Film', spec: '1/2 hours / Depends on data', unit: 'hours' },
  { name: 'Edited Photos (Master data)', spec: 'Master data', unit: '' },
  { name: 'Edited Photos (Collectives)', spec: 'Collectives', unit: '' },
  { name: 'Same Day Highlight', spec: '2/3 minutes', unit: 'minutes' },
  { name: 'All Raw Data Given', spec: '', unit: '' },
]

export const DAY_LABEL_PRESETS = [
  'DAY 1',
  'DAY 2',
  'DAY 3',
  'HALDI',
  'WEDDING',
  'RECEPTION',
  'PRE-WEDDING',
  'MEHNDI',
  'SANGEET',
]

export const STEP_LABELS = [
  'Client Details',
  'Event Days',
  'Services',
  'Post Production',
  'Pricing',
  'Preview',
]
