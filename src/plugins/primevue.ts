import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import { definePreset, palette } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import type { PaletteDesignToken } from '@primevue/themes/aura'

export default defineNuxtPlugin((nuxtApp) => {
    // Create a primary color palette
    const appConfig = useAppConfig()
    const primaryColor: PaletteDesignToken = palette(appConfig.theme.primary)

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
            // colorScheme: {
            //     light: {
            //         surface: {
            //             0: '#ffffff',
            //             50: '{zinc.50}',
            //             100: '{zinc.100}',
            //             200: '{zinc.200}',
            //             300: '{zinc.300}',
            //             400: '{zinc.400}',
            //             500: '{zinc.500}',
            //             600: '{zinc.600}',
            //             700: '{zinc.700}',
            //             800: '{zinc.800}',
            //             900: '{zinc.900}',
            //             950: '{zinc.950}'
            //         }
            //     },
            //     dark: {
            //         surface: {
            //             0: '#ffffff',
            //             50: '{slate.50}',
            //             100: '{slate.100}',
            //             200: '{slate.200}',
            //             300: '{slate.300}',
            //             400: '{slate.400}',
            //             500: '{slate.500}',
            //             600: '{slate.600}',
            //             700: '{slate.700}',
            //             800: '{slate.800}',
            //             900: '{slate.900}',
            //             950: '{slate.950}'
            //         }
            //     }
            // }
        }
    })

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
