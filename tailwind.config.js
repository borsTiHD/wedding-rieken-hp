/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './index.html',
        './nuxt.config.{js,ts}',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
    ],
    // important: true, // Disabled so it works better with PrimeVue CSS
    theme: {
        extend: {}
    },
    plugins: []
    // Tailwind - Disable preflight to avoid conflicts
    // corePlugins: {
    //     preflight: false
    // }
}
