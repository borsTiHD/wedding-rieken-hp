import type {
    DehydratedState,
    VueQueryPluginOptions
} from '@tanstack/vue-query'
import {
    VueQueryPlugin,
    QueryClient,
    hydrate,
    dehydrate
} from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
    const defaultStaleTime = 1000 * 60 * 30 // 30 minutes
    const refetchOnWindowFocus = false

    const vueQueryState = useState<DehydratedState | null>('vue-query')

    // Modify your Vue Query global settings here
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: defaultStaleTime,
                refetchOnWindowFocus
            }
        }
    })
    const options: VueQueryPluginOptions = { queryClient }

    nuxt.vueApp.use(VueQueryPlugin, options)

    if (import.meta.server) {
        nuxt.hooks.hook('app:rendered', () => {
            vueQueryState.value = dehydrate(queryClient)
        })
    }

    if (import.meta.client) {
        nuxt.hooks.hook('app:created', () => {
            hydrate(queryClient, vueQueryState.value)
        })
    }
})
