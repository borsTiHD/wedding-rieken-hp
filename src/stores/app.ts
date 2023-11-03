import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { Config } from '@/types/Config'

export const useAppStore = defineStore('app-store', () => {
    // Firestore composable
    const { queryByCollectionAndId } = useFirestore()

    // Localisation
    const { t } = useI18n()

    // Config data
    const config = ref<Config>()

    // Bride and groom names
    const bride = ref<string>('Lisa')
    const groom = ref<string>('Marcel')

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

    return { config, fetchConfig, bride, groom }
})
