import useFileServerApi from '@/composables/useFileServerApi'
import { useInfiniteQuery } from '@tanstack/vue-query'

export function useFolderInfiniteQuery(path: Ref<string | undefined>, limitValue?: Ref<number | undefined>) {
  const { getAllFilesPaginated } = useFileServerApi()
  const limit = computed(() => limitValue?.value || 20)

  return useInfiniteQuery({
    queryKey: ['gallery-folder', 'infinite', path, limit.value],
    queryFn: ({ pageParam }) => getAllFilesPaginated(path.value as string, pageParam, limit.value),
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
