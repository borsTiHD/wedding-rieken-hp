import type { Document } from '@/composables/useFirestore'

export interface DailyAgenda {
    time: string
    event: string
}

export interface Witness {
    name: string
    phone: string
}

export interface AppContent extends Document {
    'daily-agenda': DailyAgenda[]
    witnesses: Witness[]
}
