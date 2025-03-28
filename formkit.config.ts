import { createAutoAnimatePlugin } from '@formkit/addons'
import { de } from '@formkit/i18n'
import { generateClasses } from '@formkit/themes'
import { defineFormKitConfig } from '@formkit/vue'
import myTailwindTheme from './tailwind-formkit-theme.js'

// Default Theme
import '@formkit/themes/genesis'

export default defineFormKitConfig({
  locales: { de }, // Define additional locales
  locale: 'de', // Define the active locale
  // theme: 'genesis',
  plugins: [
    createAutoAnimatePlugin(),
  ],
  config: {
    classes: generateClasses(myTailwindTheme),
  },
})
