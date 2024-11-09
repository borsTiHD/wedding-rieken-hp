import { useQuery } from '@tanstack/vue-query'
import { getContent } from './functions'

export function useContentQuery() {
    return useQuery({
        queryKey: ['app', 'content'],
        queryFn: () => getContent(),
        staleTime: Number.POSITIVE_INFINITY
    })
}
