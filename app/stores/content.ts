import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import type { DailyAgenda } from '@/queries/content/model'

export const useContentStore = defineStore('content-store', () => {
    const { updateArrayFieldByCollectionAndId, removeArrayFieldByCollectionAndId } = useFirestore()

    // Add new daily agenda item
    async function addDailyAgendaItem(item: DailyAgenda) {
        return updateArrayFieldByCollectionAndId('app', 'content', 'daily-agenda', item)
    }

    // Remove daily agenda item
    async function removeDailyAgendaItem(item: DailyAgenda) {
        return removeArrayFieldByCollectionAndId('app', 'content', 'daily-agenda', item)
    }

    return { addDailyAgendaItem, removeDailyAgendaItem }
})
