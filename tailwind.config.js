/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
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



