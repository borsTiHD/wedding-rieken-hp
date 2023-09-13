/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './nuxt.config.{js,ts}',
        './index.html',
        './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
    ],
    important: true,
    theme: {
        extend: {}
    },
    plugins: []
    // Tailwind - Disable preflight to avoid conflicts
    // corePlugins: {
    //     preflight: false
    // }
}



