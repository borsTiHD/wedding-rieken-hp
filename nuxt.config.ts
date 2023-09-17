// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        // Server-side runtime config
        firebaseApikey: '',
        firebaseAuthdomain: '',
        firebaseProjectid: '',
        firebaseStoragebucket: '',
        firebaseMessagingsenderid: '',
        firebaseAppid: '',
        firebaseMeasurementid: '',
        // Client-side runtime config
        public: {
            firebase: {
                apiKey: process.env.NUXT_FIREBASE_APIKEY,
                authDomain: process.env.NUXT_FIREBASE_AUTHDOMAIN,
                projectId: process.env.NUXT_FIREBASE_PROJECTID,
                storageBucket: process.env.NUXT_FIREBASE_STORAGEBUCKET,
                messagingSenderId: process.env.NUXT_FIREBASE_MESSAGINGSENDERID,
                appId: process.env.NUXT_FIREBASE_APPID,
                measurementId: process.env.NUXT_FIREBASE_MEASUREMENTID
            }
        }
    },
    srcDir: 'src/',
    modules: [
        // ...
        '@pinia/nuxt'
    ],
    css: [
        '@/assets/css/tailwindcss.css', // tailwindcss
        'primevue/resources/themes/lara-light-blue/theme.css',
        'primevue/resources/primevue.min.css',
        'primeicons/primeicons.css'
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
