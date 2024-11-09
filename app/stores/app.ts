import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { Config, PartialConfig } from '@/queries/config/model'

export const useAppStore = defineStore('app-store', () => {
    const appConfig = useAppConfig()
    const { queryByCollectionAndId, updateByCollectionAndId } = useFirestore()
    const { t } = useI18n()

    // Config data
    const config = ref<Config>()

    // Bride and groom names
    const bride = ref<string>('Lisa')
    const groom = ref<string>('Marcel')

    // Theme color -> sets the background color of the app
    const themeColor = ref<string>(appConfig.theme.body)
    function setThemeColor(color: string) {
        themeColor.value = color
    }

    // Address
    const street = computed(() => config.value?.street)
    const city = computed(() => config.value?.city)

    const weddingDuration = computed(() => config.value?.weddingDuration || 4) // Wedding Duration: Default 4 hours
    const weddingDate = computed(() => config.value?.weddingDate?.toDate()) // Wedding Date: Format date based on timestamp
    const deadlineDate = computed(() => config.value?.deadline?.toDate()) // Deadline Date: Format date based on timestamp

    // Check if the current date/time is before the deadline
    // If config.value?.deadline is undefined, the function will compare the current date with itself, which will always be false
    const isBeforeDeadline = computed(() => new Date() < (config.value?.deadline?.toDate() || new Date()))

    // Spotify playlist
    const spotifyPlaylist = computed(() => config.value?.spotifyPlaylist)

    // Location Preview file name
    const locationPreviewFileName = computed(() => config.value?.locationPreview)

    // Fetch config data
    async function fetchConfig() {
        const response = await queryByCollectionAndId('app', 'config').catch((error) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigNotFound')
            throw new Error(errorMessage)
        })

        if (!response) {
            throw new Error(t('firebase.custom.appConfigNotFound'))
        }

        config.value = response as unknown as Config
    }

    // Update config data
    async function updateConfig(config: PartialConfig) {
        return updateByCollectionAndId('app', 'config', config)
    }

    return { config, updateConfig, fetchConfig, bride, groom, street, city, weddingDate, weddingDuration, deadlineDate, isBeforeDeadline, spotifyPlaylist, locationPreviewFileName, setThemeColor, themeColor }
})
