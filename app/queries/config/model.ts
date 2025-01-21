import type { Document } from '@/composables/useFirestore'
import type { Timestamp } from 'firebase/firestore'

// Config types
export interface Config extends Document {
  bride: string
  groom: string
  weddingDuration: number
  weddingDate: Timestamp
  deadline: Timestamp
  street: string
  city: string
  spotifyPlaylist: string
  locationPreview: string
}

// Type for the partial config
export type PartialConfig = Partial<Config>
