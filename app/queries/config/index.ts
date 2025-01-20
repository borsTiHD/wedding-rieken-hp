import { useQuery } from '@tanstack/vue-query'
import { getConfig } from './functions'

interface RequestError extends Error {
  code?: string
}

export function useConfigQuery() {
  const { $firestore } = useNuxtApp()

  return useQuery({
    queryKey: ['app', 'config'],
    queryFn: () => getConfig(),
    staleTime: Number.POSITIVE_INFINITY,
    retry: (failureCount, error: RequestError) => {
      if (error.code === 'permission-denied') {
        return false
      }
      return failureCount < 3 // Retry up to 3 times for other errors
    },
    enabled: !!$firestore,
  })
}
