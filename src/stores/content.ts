import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { AppContent, DailyAgenda } from '@/types/AppContent'

export const useContentStore = defineStore('content-store', () => {
    const { queryByCollectionAndId, updateArrayFieldByCollectionAndId, removeArrayFieldByCollectionAndId } = useFirestore()
    const { t } = useI18n()

    // App content
    const content = ref<AppContent>()
    const dailyAgenda = computed(() => content.value?.['daily-agenda'])

    // Fetch app content
    async function fetchContent() {
        const response = await queryByCollectionAndId('app', 'content').catch((error) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.appContentNotFound')
            throw new Error(errorMessage)
        })

        if (!response) {
            throw new Error(t('firebase.custom.appContentNotFound'))
        }

        content.value = response as unknown as AppContent
    }

    // Add new daily agenda item
    async function addDailyAgendaItem(item: DailyAgenda) {
        return updateArrayFieldByCollectionAndId('app', 'content', 'daily-agenda', item)
    }

    // Remove daily agenda item
    async function removeDailyAgendaItem(item: DailyAgenda) {
        return removeArrayFieldByCollectionAndId('app', 'content', 'daily-agenda', item)
    }

    return { content, dailyAgenda, fetchContent, addDailyAgendaItem, removeDailyAgendaItem }
})
