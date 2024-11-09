/** @type {import('tailwindcss').Config} */
import formKitTailwind from '@formkit/themes/tailwindcss'
import { theme } from './app/config/theme'

module.exports = {
    content: [
        './app/components/**/*.{js,vue,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/config/**/*.{js,ts}',
        './app/app.vue',
        './app/error.vue',
        './app/app.config.ts',
        // './app/**/*.{vue,js,ts,jsx,tsx} !./app/server/**/*.ts', // Workaround for not including server files - nuxt/tailwind bug since 3.9.2
        // './app/**/*.{vue,js,ts,jsx,tsx}',
        // './index.html',
        './nuxt.config.{js,ts}',
        './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}',
        './tailwind-formkit-theme.js'
    ],
    important: true,
    darkMode: 'selector',
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['Montserrat'],
                roboto: ['Roboto'],
                'great-vibes': ['Great Vibes'],
                'alex-brush': ['Alex Brush']
            },
            colors: {
                body: theme.body,
                surface: theme.surface,
                primary: theme.primary,
                secondary: theme.secondary,
                accent: theme.accent,
                'accent-2': theme['accent-2'],
                'accent-3': theme['accent-3']
            },
            backgroundImage: {
                // 1-IMG_8097.jpeg
                // 1-IMG_8139.jpeg
                // 1-IMG_8232.jpeg
                // 1-IMG_8400.jpeg

                'background-wallpaper': 'linear-gradient(rgba(203, 200, 198, 1), rgba(203, 200, 198, 0) 10%), url(\'@/assets/img/1-IMG_8232.jpeg\')'
                // 'background-wallpaper': 'url(\'@/assets/img/pexels-photo-2253870.jpeg\')'
            }
        }
    },
    plugins: [
        formKitTailwind
    ]
    // Tailwind - Disable preflight to avoid conflicts
    // corePlugins: {
    //     preflight: false
    // }
}
