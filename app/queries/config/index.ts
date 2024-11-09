import { useQuery } from '@tanstack/vue-query'
import { getConfig } from './functions'

export function useConfigQuery() {
    return useQuery({
        queryKey: ['app', 'config'],
        queryFn: () => getConfig(),
        staleTime: Number.POSITIVE_INFINITY
    })
}
