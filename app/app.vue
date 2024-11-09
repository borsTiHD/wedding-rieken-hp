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

        <!-- Footer -->
        <AppFooter />
    </div>

    <!-- Scroll to top button -->
    <ScrollTop />

    <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import AppLoadingOverlay from '@/components/layout/AppLoadingOverlay.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import useLocale from '@/composables/useLocale'
import { useConfig } from '@/composables/useConfig'
import { useContent } from '@/composables/useContent'
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
// TODO: Delete stock fotos from assets

// Localisation
const { t } = useI18n()

// Language options for i18n
// Set language based on cookie or browser language
useLocale()

// Router
const route = useRoute()
const routeName = computed(() => route.name as string || '')
const isIndex = computed(() => routeName.value.includes('index'))

// Props for 'loading' and 'progress'
// Also starts loading spinner
const { loading, progress, startLoading, stoptLoading } = useLoadingSpinner()

// Queries
const { suspense: suspenseConfig } = useConfig()
const { suspense: suspenseContent } = useContent()

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
onNuxtReady(async() => {
    startLoading() // Start loading spinner

    // Check if token is provided in route and save it in localStorage
    tokenStore.getInvitationToken()

    // Fetch data on page load
    await Promise.allSettled([
        suspenseConfig(),
        suspenseContent(),
        userStore.fetchUserData()
    ])

    stoptLoading() // Stop loading spinner
})
</script>

<style>
/* Fixing the scroll to top button position - bug since primevue v4.0.0 - something sets it to position 'relative' */
.p-scrolltop.p-button {
    position: fixed !important;
}
</style>
