import useFileServerApi from '@/composables/useFileServerApi'
import { useQuery } from '@tanstack/vue-query'

export function useFileQuery(path: Ref<string | undefined>, preview: Ref<boolean> = ref(false)) {
  const { getPreviewUrl } = useFileServerApi()

  return useQuery({
    queryKey: ['file', 'preview-url', path, preview],
    queryFn: () => {
      // Ensure path is defined
      if (!path.value) {
        throw new Error('Path is undefined')
      }
      return getPreviewUrl(path.value, preview.value)
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!path.value,
  })
}
