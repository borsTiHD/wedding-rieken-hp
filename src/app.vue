<template>
    <AppLoadingOverlay v-if="loading" :progress="progress" />
    <div v-else class="app-wrapper min-h-screen w-full flex flex-col bg-fixed">
        <Toast position="bottom-right" />

        <!-- Navbar -->
        <AppNavbar />

        <!-- Background image -->
        <div v-if="!isIndex" class="background-image fixed top-0 left-0 w-full h-full" />

        <!-- Main content -->
        <AppCookieConsent v-if="!cookieConsentAccepted && !isImprint" />
        <NuxtPage v-else class="pt-20 z-20" />

        <!-- Scroll to top button -->
        <ScrollTop />

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import AppCookieConsent from '@/components/layout/AppCookieConsent.vue'
import AppLoadingOverlay from '@/components/layout/AppLoadingOverlay.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import useLocale from '@/composables/useLocale'
import useLoadingSpinner from '@/composables/useLoadingSpinner'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTokenStore } from '@/stores/token'
import { useCookieStore } from '@/stores/cookieconsent'
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
const routePath = computed(() => route.path)
const isIndex = computed(() => routeName.value.includes('index'))
const isImprint = computed(() => {
    console.log('isImprint', route, routeName.value, routePath.value.includes('imprint'))
    return routeName.value.includes('imprint')
})

// Cookie consent
const cookieStore = useCookieStore()
const preferences = computed(() => cookieStore.preferences)
const cookieConsentAccepted = computed(() => {
    // Check if cookie consent is accepted for 'app' and 'firebase' categories
    return preferences.value?.acceptedCategories.includes('app')
        && preferences.value?.acceptedCategories.includes('firebase')
})

// Props for 'loading' and 'progress'
// Also starts loading spinner
const { loading, progress, startLoading, stoptLoading } = useLoadingSpinner()

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
    await userStore.fetchUserData().catch((error) => console.warn(error)) // Fetch user data, don't need to handle error
    await appStore.fetchConfig().catch((error) => console.warn(error)) // Fetch app config, don't need to handle error
    tokenStore.getInvitationToken() // Check if token is provided in route and save it in localStorage
    stoptLoading() // Stop loading spinner
})
</script>
