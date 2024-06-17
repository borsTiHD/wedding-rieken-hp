/** @type {import('tailwindcss').Config} */
import formKitTailwind from '@formkit/themes/tailwindcss'
import { theme } from './src/config/theme'

module.exports = {
    content: [
        './src/components/**/*.{js,vue,ts}',
        './src/layouts/**/*.vue',
        './src/pages/**/*.vue',
        './src/plugins/**/*.{js,ts}',
        './src/config/**/*.{js,ts}',
        './src/app.vue',
        './src/error.vue',
        './src/app.config.ts',
        // './src/**/*.{vue,js,ts,jsx,tsx} !./src/server/**/*.ts', // Workaround for not including server files - nuxt/tailwind bug since 3.9.2
        // './src/**/*.{vue,js,ts,jsx,tsx}',
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
                'background-wallpaper': 'linear-gradient(rgba(203, 200, 198, 1), rgba(203, 200, 198, 0) 10%), url(\'@/assets/img/pexels-photo-2253870.jpeg\')'
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
