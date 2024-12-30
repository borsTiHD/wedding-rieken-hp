import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import type { DailyAgenda, Witness } from '@/queries/content/model'

export const useContentStore = defineStore('content-store', () => {
    const { updateArrayFieldByCollectionAndId, removeArrayFieldByCollectionAndId } = useFirestore()

    // TODO: No need for a store for this, just use the composable directly

    // Add new daily agenda item
    async function addDailyAgendaItem(item: DailyAgenda) {
        return updateArrayFieldByCollectionAndId('app', 'content', 'daily-agenda', item)
    }

    // Remove daily agenda item
    async function removeDailyAgendaItem(item: DailyAgenda) {
        return removeArrayFieldByCollectionAndId('app', 'content', 'daily-agenda', item)
    }

    // Add new witness
    async function addWitness(witness: Witness) {
        return updateArrayFieldByCollectionAndId('app', 'content', 'witnesses', witness)
    }

    // Remove witness
    async function removeWitness(witness: Witness) {
        return removeArrayFieldByCollectionAndId('app', 'content', 'witnesses', witness)
    }

    return {
        addDailyAgendaItem,
        removeDailyAgendaItem,
        addWitness,
        removeWitness
    }
})
