// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        firebase_apiKey: '', // can be overridden by NUXT_API_SECRET environment variable
        firebase_authDomain: '',
        firebase_projectId: '',
        firebase_storageBucket: '',
        firebase_messagingSenderId: '',
        firebase_appId: '',
        firebase_measurementId: ''
    },
    devtools: { enabled: true }
})
