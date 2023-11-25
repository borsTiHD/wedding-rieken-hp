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

    // Deadline Date: Format date based on timestamp
    const deadlineDate = computed(() => {
        if (!config.value?.deadline) return 0
        return new Date(config.value?.deadline * 1000)
    })

    // Check if the current date/time is before the deadline
    const isBeforeDeadline = computed(() => {
        if (!config.value?.deadline) return false
        return Date.now() < config.value?.deadline * 1000
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

    return { config, updateConfig, fetchConfig, bride, groom, deadlineDate, isBeforeDeadline, setThemeColor, themeColor }
})
