import useFileServerApi from '@/composables/useFileServerApi'
import { useQuery } from '@tanstack/vue-query'

export function useFileQuery(path: Ref<string | undefined>) {
  const { getPreviewUrl } = useFileServerApi()

  return useQuery({
    queryKey: ['file', 'preview-url', path],
    queryFn: () => getPreviewUrl(path.value as string),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!path.value,
  })
}
