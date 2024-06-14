import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import { definePreset, palette } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

// Create a primary color palette
const primaryColor = palette('#335C67')

// Define a new preset based on Aura
const AppPreset = definePreset(Aura, {
    semantic: {
        primary: {
            // 50: '{amber.50}',
            // 100: '{amber.100}',
            // 200: '{amber.200}',
            // 300: '{amber.300}',
            // 400: '{amber.400}',
            // 500: '{amber.500}',
            // 600: '{amber.600}',
            // 700: '{amber.700}',
            // 800: '{amber.800}',
            // 900: '{amber.900}',
            // 950: '{amber.950}'

            50: primaryColor[50],
            100: primaryColor[100],
            200: primaryColor[200],
            300: primaryColor[300],
            400: primaryColor[400],
            500: primaryColor[500],
            600: primaryColor[600],
            700: primaryColor[700],
            800: primaryColor[800],
            900: primaryColor[900],
            950: primaryColor[950]
        }
    }
})

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        ripple: true,
        theme: {
            preset: AppPreset,
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
