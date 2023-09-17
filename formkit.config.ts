import { defineFormKitConfig } from '@formkit/vue'
import { createAutoAnimatePlugin } from '@formkit/addons'
// import { generateClasses } from '@formkit/themes'
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
        // classes: generateClasses({
        //     text: {
        //         label: 'dark:text-white',
        //         help: 'dark:text-white',
        //         input: 'placeholder:text-neutral-500 dark:text-white',
        //         wrapper: 'max-w-full'
        //     },
        //     number: {
        //         label: 'dark:text-white',
        //         help: 'dark:text-white',
        //         input: 'placeholder:text-neutral-500 dark:text-white',
        //         wrapper: 'max-w-full'
        //     },
        //     select: {
        //         label: 'dark:text-white',
        //         help: 'dark:text-white',
        //         input: 'placeholder:text-neutral-500 dark:text-white cursor-pointer',
        //         option: 'dark:text-black',
        //         wrapper: 'max-w-full'
        //     },
        //     textarea: {
        //         label: 'dark:text-white',
        //         help: 'dark:text-white',
        //         input: 'placeholder:text-neutral-500 dark:text-white',
        //         wrapper: 'max-w-full'
        //     },
        //     file: {
        //         label: 'dark:text-white',
        //         help: 'dark:text-white',
        //         noFiles: 'placeholder:text-neutral-500 dark:text-white',
        //         wrapper: 'max-w-full'
        //     }
        // })
    }
})
