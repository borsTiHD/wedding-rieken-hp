import { defineStore } from 'pinia'
import { useFirestore } from '@/composables/useFirestore'
import type { Config } from '@/types/config'

export const useAppStore = defineStore('app-store', () => {
    // Firestore composable
    const { queryByCollectionAndId } = useFirestore()

    // Config data
    const config = ref<Config>()

    // Fetch config data
    async function fetchConfig() {
        // If collection and id is specified, return document from collection
        const response = await queryByCollectionAndId('app', 'config') as Config

        // Throw error if no response
        if (!response) {
            throw new Error('No response for app config')
        }

        // Set config data
        config.value = response
    }

    return { config, fetchConfig }
})
