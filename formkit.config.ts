import { defineFormKitConfig } from '@formkit/vue'
import { createAutoAnimatePlugin } from '@formkit/addons'
import { generateClasses } from '@formkit/themes'
import { de } from '@formkit/i18n'

// Default Theme
import '@formkit/themes/genesis'

export default defineFormKitConfig({
    locales: { de }, // Define additional locales
    locale: 'de', // Define the active locale
    theme: 'genesis',
    plugins: [
        createAutoAnimatePlugin()
    ],
    config: {
        classes: generateClasses({
            global: {
                wrapper: 'max-w-full'
            }
        })
    }
})
