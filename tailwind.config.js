/** @type {import('tailwindcss').Config} */
import formKitTailwind from '@formkit/themes/tailwindcss'

module.exports = {
    content: [
        './index.html',
        './nuxt.config.{js,ts}',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}',
        './tailwind-formkit-theme.js'
    ],
    important: true,
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['Montserrat'],
                roboto: ['Roboto']
            },
            colors: {
                // Colors: read more in 'primevue-designer-colors.md'
                body: '#cbc8c6', // body background color
                footer: '#E8E8F0', // footer background color, '#0f172a' for dark theme
                primary: '#335C67', // primary color
                secondary: '#FFF3B0', // secondary color
                accent: '#E09F3E', // accent color
                'accent-2': '#9E2A2B', // accent color 2
                'accent-3': '#540B0E' // accent color 3
            },
            backgroundImage: {
                // 'background-wallpaper': 'linear-gradient(rgba(203, 200, 198, 1), rgba(203, 200, 198, 0) 10%), url(\'@/assets/img/pexels-photo-2253870.jpeg\')'
                'background-wallpaper': 'url(\'@/assets/img/pexels-photo-2253870.jpeg\')'
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
