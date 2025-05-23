import { defineNuxtPlugin } from '#app'
import { definePreset, palette } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  // Create a primary color palette
  const appConfig = useAppConfig()
  const primaryColor = palette(appConfig.theme.primary)

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
        950: primaryColor[950],
      },
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
    },
  })

  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    components: {
      exclude: ['Form', 'FormField'],
    },
    theme: {
      preset: AppPreset,
      options: {
        prefix: 'p',
        darkModeSelector: 'dark',
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
    pt: {
      card: {
        root: 'rounded-3xl ring-1 ring-slate-900/5 shadow-xl card-with-icon max-w-full',
      },
      popover: {
        root: 'rounded-3xl ring-1 ring-slate-900/5 shadow-xl',
      },
      button: {
        label: 'truncate',
      },
    },
    directives: {
      include: ['Tooltip'],
    },
  })
})
