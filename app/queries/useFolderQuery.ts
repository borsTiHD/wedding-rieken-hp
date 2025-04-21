import useFileServerApi from '@/composables/useFileServerApi'
import { useQuery } from '@tanstack/vue-query'

export function useFolderQuery(path: Ref<string | undefined>, limit?: Ref<number | undefined>) {
  const { getAllFiles } = useFileServerApi()

  return useQuery({
    queryKey: ['folder', path, limit],
    queryFn: () => getAllFiles(path.value as string, limit?.value),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!path.value,
  })
}
