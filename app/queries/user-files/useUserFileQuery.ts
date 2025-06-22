import type { ImageMode } from '@/composables/useFileServerApi'
import useUserFileServerApi from '@/composables/useUserFileServerApi'
import { useQuery } from '@tanstack/vue-query'

export function useUserFileQuery(path: Ref<string | undefined>, mode: Ref<ImageMode> = ref('thumbnail'), enabled: Ref<boolean> = ref(true)) {
  const { getPreviewBuffer } = useUserFileServerApi()

  return useQuery({
    queryKey: ['user-file', 'preview-buffer', path, mode],
    queryFn: () => {
      // Ensure path is defined
      if (!path.value) {
        throw new Error('Path is undefined')
      }
      return getPreviewBuffer(path.value, mode.value)
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: computed(() => enabled.value && !!path.value),
  })
}
