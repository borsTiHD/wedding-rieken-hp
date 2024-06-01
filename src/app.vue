<template>
    <AppLoadingOverlay v-if="loading" :progress="progress" />
    <div v-else class="app-wrapper min-h-screen w-full flex flex-col bg-fixed">
        <Toast position="bottom-right" />

        <!-- Navbar -->
        <AppNavbar />

        <!-- Background image -->
        <div v-if="!isIndex" class="background-image fixed top-0 left-0 w-full h-full" />

        <!-- Main content -->
        <NuxtPage class="pt-20 z-20" />

        <!-- Scroll to top button -->
        <ScrollTop />

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import AppLoadingOverlay from '@/components/layout/AppLoadingOverlay.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import useLocale from '@/composables/useLocale'
import useLoadingSpinner from '@/composables/useLoadingSpinner'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTokenStore } from '@/stores/token'
import '@fontsource/roboto'
import '@fontsource/roboto/700.css'
import '@fontsource/montserrat'
import '@fontsource/great-vibes'
import '@fontsource/alex-brush'

// TODO: Fix "toast" styling on mobile (toast is glitching)

// Localisation
const { t } = useI18n()

// Language options for i18n
// Set language based on cookie or browser language
useLocale()

// Router
const route = useRoute()
const routeName = computed(() => route.name as string)
const isIndex = computed(() => routeName.value.includes('index'))

// Props for 'loading' and 'progress'
// Also starts loading spinner
const { loading, progress, stoptLoading } = useLoadingSpinner(true)

// Stores
const appStore = useAppStore() // App store
const userStore = useUserStore() // User store
const tokenStore = useTokenStore() // Token store

// Refs
const bride = computed(() => appStore.bride)
const groom = computed(() => appStore.groom)
const titel = computed(() => t('head.titel', { bride: bride.value, groom: groom.value }))
const description = computed(() => t('head.description', { bride: bride.value, groom: groom.value }))

// Set theme color
const themeColor = computed(() => appStore.themeColor)
watch(themeColor, (newValue) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', newValue)
})

// Set meta tags
useHead({
    title: titel.value,
    meta: [
        {
            name: 'description',
            content: description.value
        },
        {
            name: 'theme-color',
            content: themeColor.value
        }
    ]
})

// Fetch user data and app config
onMounted(async() => {
    await userStore.fetchUserData().catch((error) => console.warn(error)) // Fetch user data, don't need to handle error
    await appStore.fetchConfig().catch((error) => console.warn(error)) // Fetch app config, don't need to handle error
    tokenStore.getInvitationToken() // Check if token is provided in route and save it in localStorage
    stoptLoading() // Stop loading spinner
})
</script>

<style>
/* Background color */
body, html {
    /* background: linear-gradient(to bottom, #ff0000, #0000ff); */
    /* @apply bg-gradient-to-b from-body to-footer !important; */
    @apply bg-body font-great-vibes -z-50 !important;
}

/* Background image */
.background-image {
    @apply bg-background-wallpaper bg-center bg-cover bg-no-repeat !important;
}

/* Main content wrapper */
.content-sizer { @apply w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 !important; }
.content-flex { @apply mx-auto flex flex-col gap-4 p-4 !important; }
.content-wrapper { @apply content-flex content-sizer !important; }

/* Styling for all cards */
.card-primary {
    @apply bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-xl !important; /* bg-[#FFF3B0] */
}

/* Profile list items */
.profile-list-item {
    @apply flex items-center justify-between py-2 !important;
}
</style>
