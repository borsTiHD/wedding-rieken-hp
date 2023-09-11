import { defineStore } from 'pinia'
import type { DataResults, Config } from '@/types/config'

export const useAppStore = defineStore('app-store', () => {
    const config = ref<Config>()

    async function fetchConfig() {
        const response = await useFetch('/api/query', {
            query: {
                col: 'app'
            }
        })

        // Throw error if no response
        if (!response) {
            throw new Error('No response for app config')
        }

        // Set config data
        const data = response.data.value as DataResults
        config.value = data.result[0]
    }

    return { config, fetchConfig }
})
