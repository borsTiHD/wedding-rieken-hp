import type { ImageMode } from '@/composables/useFileServerApi'
import useFileServerApi from '@/composables/useFileServerApi'
import { useQuery } from '@tanstack/vue-query'

export function useFileQuery(path: Ref<string | undefined>, mode: Ref<ImageMode> = ref('thumbnail'), enabled: Ref<boolean> = ref(true)) {
  const { getPreviewUrl } = useFileServerApi()

  return useQuery({
    queryKey: ['file', 'preview-url', path, mode],
    queryFn: () => {
      // Ensure path is defined
      if (!path.value) {
        throw new Error('Path is undefined')
      }
      return getPreviewUrl(path.value, mode.value)
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: computed(() => enabled.value && !!path.value),
  })
}
