import { useContentQuery } from '@/queries/content'
import { useFirestore } from '@/composables/useFirestore'
import type { DailyAgenda, Witness } from '@/queries/content/model'

export function useContent() {
    const { data: contentData, isFetching, isLoading, error, isSuccess, refetch, suspense } = useContentQuery()
    const { updateArrayFieldByCollectionAndId, removeArrayFieldByCollectionAndId } = useFirestore()

    const dailyAgenda = computed<DailyAgenda[]>(() => {
        const dailyAgenda = contentData.value?.['daily-agenda']

        // Sort by time
        const sortedAgenda = dailyAgenda ? [...dailyAgenda].sort((a: DailyAgenda, b: DailyAgenda) => {
            const timeA = new Date(`1970-01-01T${a.time}:00Z`).getTime()
            const timeB = new Date(`1970-01-01T${b.time}:00Z`).getTime()
            return timeA - timeB
        }) : []

        return sortedAgenda
    })

    const witnesses = computed<Witness[] | undefined>(() => contentData.value?.witnesses)

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
        // Query
        contentData,
        isFetching,
        isLoading,
        error,
        isSuccess,
        refetch,
        suspense,

        // Computed
        dailyAgenda,
        witnesses,

        // Mutations
        addDailyAgendaItem,
        removeDailyAgendaItem,
        addWitness,
        removeWitness
    }
}
