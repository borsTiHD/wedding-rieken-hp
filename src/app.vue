<template>
    <LoadingOverlay v-if="loading" :progress="progress" />
    <div v-else class="app-wrapper">
        <Toast position="bottom-right" />

        <AppNavbar />
        <main class="p-4 mx-auto flex flex-col gap-4" :class="mainClasses">
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import useLoadingSpinner from '@/composables/useLoadingSpinner'
import useInvitiationToken from '@/composables/useInvitiationToken'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// Props for 'loading' and 'progress'
// Also starts loading spinner
const { loading, progress, stoptLoading } = useLoadingSpinner(true)

// Stores
const appStore = useAppStore() // App store
const userStore = useUserStore() // User store

// Save invitiation token from route if provided
const { getInvitiationToken } = useInvitiationToken()

// Language options for i18n
// Also set language based on cookie or browser language
const { getLocaleCookie, setLocaleCookie, getBrowserLocale, setLocale } = useI18n()
const browserLocale = getBrowserLocale()
const cookieLocale = getLocaleCookie()
if (cookieLocale) {
    setLocaleCookie(cookieLocale)
    setLocale(cookieLocale)
} else if (browserLocale) {
    setLocaleCookie(browserLocale)
    setLocale(browserLocale)
} else {
    setLocaleCookie('de')
    setLocale('de')
}

// Main section responsive classes
const mainClasses = computed(() => {
    // Set responsive classes based on route name
    // If route name includes 'admin' use a wider width
    const routeName = useRoute().name as string
    if (routeName.includes('admin')) {
        return 'sm:w-11/12 md:w-10/12 lg:w-8/12'
    }
    return 'sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12'
})

// Fetch user data and app config
onMounted(async() => {
    await userStore.fetchUserData().catch((error) => console.warn(error)) // Fetch user data, don't need to handle error
    await appStore.fetchConfig().catch((error) => console.warn(error)) // Fetch app config, don't need to handle error
    getInvitiationToken() // Check if token is provided in route and save it in localStorage
    stoptLoading() // Stop loading spinner
})
</script>

<style>
body {
    /* background-color: #1F2937;
    color: #fff; */
    --tw-bg-opacity: 1 !important;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity)) !important;
    /* background-color: #E09F3E !important; */

    /* Background Image */
    @apply bg-background-wallpaper bg-fixed bg-top bg-repeat-x bg-[length:auto_140%] !important;
}

/* Styling for all cards */
.card-primary {
    @apply bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-xl !important; /* bg-[#FFF3B0] */
}

/* Profile list items */
.profile-list-item {
    @apply flex items-center justify-between border-b-2 mb-2 pb-2 !important;
}
</style>
