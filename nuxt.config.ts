// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        firebaseApikey: '', // can be overridden by NUXT_API_SECRET environment variable
        firebaseAuthdomain: '',
        firebaseProjectid: '',
        firebaseStoragebucket: '',
        firebaseMessagingsenderid: '',
        firebaseAppid: '',
        firebaseMeasurementid: ''
    },
    modules: [
        // ...
        '@pinia/nuxt'
    ],
    css: [
        '~/assets/css/tailwindcss.css', // tailwindcss
        'primevue/resources/themes/lara-light-blue/theme.css',
        'primevue/resources/primevue.min.css'
    ],
    build: {
        transpile: ['primevue']
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    devtools: { enabled: true }
})
