import type { Timestamp } from '@firebase/firestore-types'

// Config types
export interface Config {
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
