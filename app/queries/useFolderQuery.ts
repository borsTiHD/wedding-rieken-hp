import useFileServerApi from '@/composables/useFileServerApi'
import { useQuery } from '@tanstack/vue-query'

export function useFolderQuery(path: Ref<string | undefined>) {
  const { getAllFiles } = useFileServerApi()

  return useQuery({
    queryKey: ['files', path],
    queryFn: () => getAllFiles(path.value as string),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!path.value,
  })
}
