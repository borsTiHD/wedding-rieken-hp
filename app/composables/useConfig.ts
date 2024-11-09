import { useConfigQuery } from '@/queries/config'

export function useConfig() {
    const { data: configData, isFetching, isLoading, error, isSuccess, refetch, suspense } = useConfigQuery()

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
        street,
        city,
        weddingDuration,
        weddingDate,
        deadlineDate,
        isBeforeDeadline,
        spotifyPlaylist,
        locationPreviewFileName
    }
}
