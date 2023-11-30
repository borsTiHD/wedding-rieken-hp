import type { Timestamp } from '@firebase/firestore-types'

// Config types
export interface Config {
    weddingDate: Timestamp,
    deadline: number,
}

// Type for the partial config
export type PartialConfig = Partial<Config>;
