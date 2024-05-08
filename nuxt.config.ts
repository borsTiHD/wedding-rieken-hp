// Function checks a single environment variable
function checkEnvironmentVariable(variableName: string): void {
    if (!process.env[variableName]) {
        throw new Error(`Firebase: Missing environment variable ${variableName}`)
    }
}

// All required environment variables
function isValidEnvironment(): void {
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_PROJECTID')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_PRIVATE_KEY_ID')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_PRIVATE_KEY')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_CLIENT_EMAIL')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_CLIENT_ID')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_AUTH_URI')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_TOKEN_URI')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL')
    checkEnvironmentVariable('NUXT_FIREBASE_ADMIN_CLIENT_X509_CERT_URL')
    checkEnvironmentVariable('NUXT_FIREBASE_APIKEY')
    checkEnvironmentVariable('NUXT_FIREBASE_AUTHDOMAIN')
    checkEnvironmentVariable('NUXT_FIREBASE_PROJECTID')
    checkEnvironmentVariable('NUXT_FIREBASE_STORAGEBUCKET')
    checkEnvironmentVariable('NUXT_FIREBASE_MESSAGINGSENDERID')
    checkEnvironmentVariable('NUXT_FIREBASE_APPID')
    checkEnvironmentVariable('NUXT_FIREBASE_MEASUREMENTID')
}

// Check if all environment variables are set correctly
isValidEnvironment()

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
            }
        }
    },
    srcDir: 'src/',
    modules: [
        '@pinia/nuxt',
        '@formkit/nuxt',
        '@nuxtjs/i18n'
    ],
    css: [
        'flag-icons/css/flag-icons.min.css', // https://github.com/lipis/flag-icons/tree/main
        // 'primevue/resources/themes/lara-light-blue/theme.css',
        'primevue/resources/primevue.min.css',
        'primeicons/primeicons.css',
        '@/assets/css/theme.css', // custom primevue theme -> look at primevue-designer-colors.md
        '@/assets/css/tailwindcss.css', // tailwindcss
        '@/assets/css/animation.css', // custom animations by borstihd
        '@/assets/css/animista.css' // animista animations
    ],
    router: {
        options: {
            scrollBehaviorType: 'auto'
        }
    },
    build: {
        transpile: ['primevue', 'vue-i18n']
    },
    postcss: {
        plugins: {
            // tailwindcss: {},
            // autoprefixer: {}
            'postcss-import': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    i18n: {
        defaultLocale: 'de',
        locales: [
            { code: 'de', iso: 'de-DE', name: 'Deutsch' },
            { code: 'us', iso: 'en-US', name: 'English' }
        ],
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root' // recommended
        },
        vueI18n: './i18n.config.ts'
    },
    devtools: { enabled: process.env.NODE_ENV !== 'production' }
})
