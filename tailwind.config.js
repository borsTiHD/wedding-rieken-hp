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
                'body': '#cbc8c6' // body background color
            },
            backgroundImage: {
                'background-wallpaper': 'linear-gradient(rgba(203, 200, 198, 1), rgba(203, 200, 198, 0) 10%), url(\'@/assets/img/pexels-photo-2253870.jpeg\')'
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
