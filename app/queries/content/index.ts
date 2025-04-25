import { useQuery } from '@tanstack/vue-query'
import { getContent } from './functions'

interface RequestError extends Error {
  code?: string
}

export function useContentQuery() {
  const { $firestore } = useNuxtApp()

  return useQuery({
    queryKey: ['app', 'content'],
    queryFn: () => getContent(),
    staleTime: Number.POSITIVE_INFINITY,
    retry: (failureCount, error: RequestError) => {
      if (error.code === 'permission-denied') {
        return false
      }
      return failureCount < 2 // Retry up to 2 times for other errors
    },
    enabled: !!$firestore,
  })
}
