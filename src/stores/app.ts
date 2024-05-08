import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { Config, PartialConfig } from '@/types/Config'

export const useAppStore = defineStore('app-store', () => {
    // Firestore composable
    const { queryByCollectionAndId, updateByCollectionAndId } = useFirestore()

    // Localisation
    const { t } = useI18n()

    // Config data
    const config = ref<Config>()

    // Bride and groom names
    const bride = ref<string>('Lisa')
    const groom = ref<string>('Marcel')

    // Theme color
    const themeColor = ref<string>('#cbc8c6')
    function setThemeColor(color: string) {
        themeColor.value = color
    }

    // Wedding Duration (in hours)
    const weddingDuration = computed(() => {
        // TODO: How long is the wedding running? Change the value to the actual duration in hours
        return 4
    })

    // Wedding Date: Format date based on timestamp
    const weddingDate = computed(() => {
        if (!config.value?.weddingDate) return 0
        return config.value?.weddingDate.toDate()
    })

    // Deadline Date: Format date based on timestamp
    const deadlineDate = computed(() => {
        if (!config.value?.deadline) return 0
        return config.value?.deadline.toDate()
    })

    // Check if the current date/time is before the deadline
    const isBeforeDeadline = computed(() => {
        if (!config.value?.deadline) return false
        return new Date() < config.value?.deadline.toDate()
    })

    // Fetch config data
    async function fetchConfig() {
        // If collection and id is specified, return document from collection
        const response = await queryByCollectionAndId('app', 'config').catch((error) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigNotFound')
            throw new Error(errorMessage)
        })

        // Throw error if no response
        if (!response) {
            throw new Error(t('firebase.custom.appConfigNotFound'))
        }

        // Set config data
        config.value = response as unknown as Config
    }

    // Update config data
    async function updateConfig(config: PartialConfig) {
        return updateByCollectionAndId('app', 'config', config)
    }

    return { config, updateConfig, fetchConfig, bride, groom, weddingDate, weddingDuration, deadlineDate, isBeforeDeadline, setThemeColor, themeColor }
})
