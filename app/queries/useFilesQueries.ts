import type { ImageMode } from '@/composables/useFileServerApi'
import useFileServerApi from '@/composables/useFileServerApi'
import { useQueries } from '@tanstack/vue-query'

export function useFilesQueries(paths: Ref<string[] | undefined>, mode: Ref<ImageMode> = ref('thumbnail')) {
  const { getPreviewUrl } = useFileServerApi()

  const queries = computed(() => paths.value && paths.value?.length > 0
    ? paths.value.map((path) => {
        return {
          queryKey: ['file', 'preview-url', path, mode],
          queryFn: () => getPreviewUrl(path, mode.value),
          staleTime: Number.POSITIVE_INFINITY,
          enabled: !!paths.value,
        }
      })
    : [])
  return useQueries({
    queries,
    combine: (results) => {
      return {
        data: results.map(result => result.data),
        isLoading: results.some(result => result.isPending || result.isLoading || result.isFetching),
      }
    },
  })
}
