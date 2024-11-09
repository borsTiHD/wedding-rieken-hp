import type { Timestamp } from '@firebase/firestore-types'
import type { Document } from '@/composables/useFirestore'

// Config types
export interface Config extends Document {
    weddingDuration: number,
    weddingDate: Timestamp,
    deadline: Timestamp,
    street: string,
    city: string,
    spotifyPlaylist: string,
    locationPreview: string,
}

// Type for the partial config
export type PartialConfig = Partial<Config>;
