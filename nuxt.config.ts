// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        // Server-side runtime config
        firebaseAdmin: {
            projectId: process.env.NUXT_FIREBASE_ADMIN_PROJECTID,
            privateKeyId: process.env.NUXT_FIREBASE_ADMIN_PRIVATE_KEY_ID,
            privateKey: process.env.NUXT_FIREBASE_ADMIN_PRIVATE_KEY,
            clientEmail: process.env.NUXT_FIREBASE_ADMIN_CLIENT_EMAIL,
            clientId: process.env.NUXT_FIREBASE_ADMIN_CLIENT_ID,
            authUri: process.env.NUXT_FIREBASE_ADMIN_AUTH_URI,
            tokenUri: process.env.NUXT_FIREBASE_ADMIN_TOKEN_URI,
            authProviderX509CertUrl: process.env.NUXT_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
            clientC509CertUrl: process.env.NUXT_FIREBASE_ADMIN_CLIENT_X509_CERT_URL
        },
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
            },
            firebaseAuthEmailSigninUrl: process.env.NUXT_FIREBASE_AUTH_EMAIL_SIGNIN_URL
        }
    },
    srcDir: 'src/',
    modules: [
        // ...
        '@pinia/nuxt',
        '@formkit/nuxt'
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
