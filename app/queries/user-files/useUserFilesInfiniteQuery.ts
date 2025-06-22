import useUserFileServerApi from '@/composables/useUserFileServerApi'
import { useInfiniteQuery } from '@tanstack/vue-query'

export function useUserFilesInfiniteQuery(limitValue?: Ref<number | undefined>) {
  const { getAllFilesPaginated } = useUserFileServerApi()
  const limit = computed(() => limitValue?.value || 20)

  return useInfiniteQuery({
    queryKey: ['user-folder', 'infinite', limit.value],
    queryFn: ({ pageParam }) => getAllFilesPaginated(pageParam, limit.value),
    staleTime: Number.POSITIVE_INFINITY,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Check if the total number of files is less than the next offset
      if (lastPage.count === 0 || lastPage.nextOffset >= lastPage.total) {
        return undefined
      }
      return lastPage.nextOffset
    },
    // getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    //   if (firstPageParam <= 1) {
    //     return undefined
    //   }
    //   return firstPageParam - 1
    // },
  })
}
