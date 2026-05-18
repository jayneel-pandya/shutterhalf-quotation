import type { AvailableService } from '../types'

export const AVAILABLE_SERVICES: AvailableService[] = [
  { name: 'Cinematographer', category: 'Video' },
  { name: 'Candid Photographer', category: 'Photo' },
  { name: 'Family Photographer', category: 'Photo' },
  { name: 'Ritual Photographer', category: 'Photo' },
  { name: 'Ritual Videographer', category: 'Video' },
  { name: 'Drone', category: 'Equipment' },
  { name: 'Traditional Photographer', category: 'Photo' },
  { name: 'Associate Photographer', category: 'Photo' },
  { name: 'Video Editor', category: 'Post' },
  { name: 'Photo Editor', category: 'Post' },
  { name: 'Spot Lighting', category: 'Equipment' },
  { name: 'LED Wall', category: 'Equipment' },
]

export const POST_PRODUCTION_TEMPLATES = [
  'Cinematic Teaser',
  'Cinematic Highlight',
  'Short Film',
  'Edited Photos',
  'Wedding Album',
  'Wedding Magazine',
  'Instagram Reels',
  'Raw Data',
  'Ritual Video',
  'Highlight Video',
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
