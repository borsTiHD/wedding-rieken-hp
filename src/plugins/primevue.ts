import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        ripple: true,
        theme: {
            preset: Aura,
            options: {
                prefix: 'p',
                darkModeSelector: 'dark',
                cssLayer: {
                    name: 'primevue',
                    order: 'tailwind-base, primevue, tailwind-utilities'
                }
            }
        },
        pt: {
            button: {
                label: 'truncate'
            }
        },
        components: {
            include: '*' // Include all components
        },
        directives: {
            include: ['Tooltip']
        }
    })
})
