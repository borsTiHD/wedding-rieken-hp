import { useContentQuery } from '@/queries/content'
import type { DailyAgenda } from '@/queries/content/model'

export function useContent() {
    const { data: contentData, isFetching, isLoading, error, isSuccess, refetch, suspense } = useContentQuery()

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
        dailyAgenda
    }
}
