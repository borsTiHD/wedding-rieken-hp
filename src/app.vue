<template>
    <LoadingOverlay v-if="loading" :progress="progress" />
    <div v-else class="app-wrapper min-h-screen flex flex-col background-image bg-fixed">
        <Toast position="bottom-right" />

        <!-- Navbar -->
        <AppNavbar />

        <!-- Main content -->
        <NuxtPage class="pt-20" />

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import useLoadingSpinner from '@/composables/useLoadingSpinner'
import useInvitiationToken from '@/composables/useInvitiationToken'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import '@fontsource/roboto'
import '@fontsource/roboto/700.css'
import '@fontsource/montserrat'

// TODO: Change favicon
// TODO: Fix background image on mobile

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

// Fetch user data and app config
onMounted(async() => {
    await userStore.fetchUserData().catch((error) => console.warn(error)) // Fetch user data, don't need to handle error
    await appStore.fetchConfig().catch((error) => console.warn(error)) // Fetch app config, don't need to handle error
    getInvitiationToken() // Check if token is provided in route and save it in localStorage
    stoptLoading() // Stop loading spinner
})
</script>

<style>
/* Background color */
body {
    @apply bg-body !important;
}

/* Background image */
.background-image {
    @apply bg-background-wallpaper bg-center bg-cover bg-no-repeat !important;
}

/* Main content wrapper */
.content-wrapper {
    @apply mx-auto flex flex-col gap-4 p-4 sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 !important;
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
