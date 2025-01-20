import { useConfigQuery } from '@/queries/config'

export function useConfig() {
  const { data: configData, isFetching, isLoading, error, isSuccess, refetch, suspense } = useConfigQuery()
  const { getFileUrl } = useFirebaseStorage()

  // Bride and groom names
  const bride = computed(() => configData.value?.bride)
  const groom = computed(() => configData.value?.groom)

  // Address
  const street = computed(() => configData.value?.street)
  const city = computed(() => configData.value?.city)

  // Dates and duration
  const weddingDuration = computed(() => configData.value?.weddingDuration || 4) // Wedding Duration: Default 4 hours
  const weddingDate = computed(() => configData.value?.weddingDate?.toDate()) // Wedding Date: Format date based on timestamp
  const deadlineDate = computed(() => configData.value?.deadline?.toDate()) // Deadline Date: Format date based on timestamp

  // Check if the current date/time is before the deadline
  // If config.value?.deadline is undefined, the function will compare the current date with itself, which will always be false
  const isBeforeDeadline = computed(() => new Date() < (deadlineDate.value || new Date()))

  // Spotify playlist
  const spotifyPlaylist = computed(() => configData.value?.spotifyPlaylist)

  // Location Preview file name
  const locationPreviewFileName = computed(() => configData.value?.locationPreview)
  const locationPreviewUrl = ref<string | null>(null)

  // Watch for changes in location preview file name
  watchEffect(async () => {
    if (locationPreviewFileName.value) {
      const path = `app/${locationPreviewFileName.value}`
      locationPreviewUrl.value = await getFileUrl(path)
    }
    else {
      locationPreviewUrl.value = null
    }
  })

  return {
    // Query
    configData,
    isFetching,
    isLoading,
    error,
    isSuccess,
    refetch,
    suspense,

    // Computed values
    bride,
    groom,
    street,
    city,
    weddingDuration,
    weddingDate,
    deadlineDate,
    isBeforeDeadline,
    spotifyPlaylist,
    locationPreviewFileName,
    locationPreviewUrl,
  }
}
