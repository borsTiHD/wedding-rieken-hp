<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
import AppLoadingOverlay from '@/components/layout/AppLoadingOverlay.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import { useConfig } from '@/composables/useConfig'
import { useContent } from '@/composables/useContent'
import useLoadingSpinner from '@/composables/useLoadingSpinner'
import useLocale from '@/composables/useLocale'
import { useAppStore } from '@/stores/app'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import '@fontsource/roboto'
import '@fontsource/roboto/700.css'
import '@fontsource/montserrat'
import '@fontsource/great-vibes'
import '@fontsource/alex-brush'

// TODO: Fix "toast" styling on mobile (toast is glitching)
// TODO: Delete stock fotos from assets

// Composables
const { t } = useI18n()
const toast = useToast()
const { changeRoleToInvited } = useFirebaseUserProfile()

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
const { suspense: suspenseConfig, error: errorConfig } = useConfig()
const { suspense: suspenseContent, error: errorContent } = useContent()

watch([errorContent, errorConfig], ([errorContentValue, errorConfigValue]) => {
  const error = errorContentValue || errorConfigValue
  if (error) {
    console.error('Error fetching content:', error.message)
  }
})

// Stores
const appStore = useAppStore() // App store
const userStore = useUserStore() // User store
const tokenStore = useTokenStore() // Token store

// Invitation token
const token = computed(() => tokenStore.token)

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
      content: description.value,
    },
    {
      name: 'theme-color',
      content: themeColor.value,
    },
  ],
})

// Check user role and upgrade if necessary
async function upgradeUserRole() {
  // Check if user is logged in
  if (!userStore.uid) {
    return false
  }

  // Check if user has an invitation token
  // And change profile role to 'invited'
  // Firebase will check if the token is valid
  if (token.value && token.value !== '') {
    const check = await changeRoleToInvited(token.value).catch((error: { message: string }) => {
      toast.add({
        severity: 'error',
        summary: t('user.upgradeUserRole.error'),
        detail: error.message,
        life: 10000,
      })

      return false
    })

    if (!check) {
      return false
    }

    toast.add({
      severity: 'success',
      summary: t('user.upgradeUserRole.success'),
      detail: t('user.upgradeUserRole.successDetail'),
      life: 10000,
    })
  }
}

// Fetch user data and app config
onNuxtReady(async () => {
  startLoading() // Start loading spinner

  // Check if token is provided in route and save it in localStorage
  tokenStore.getInvitationToken()

  // Fetch data on page load
  const results = await Promise.allSettled([
    suspenseConfig(),
    suspenseContent(),
    userStore.fetchUserData(),
  ])

  let error = false
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Error fetching data:', result.reason)
      error = true
    }
  })

  // Check if any of the promises were rejected
  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Es konnten nicht alle Inhalte geladen werden. Bitte versuche es später erneut.',
      life: 10000,
    })
  }

  stoptLoading() // Stop loading spinner

  // Upgrade user role if necessary (e.g. from 'guest' to 'invited')
  // User must be logged in and have an invitation token
  setTimeout(() => {
    upgradeUserRole()
  }, 2000)
})
</script>

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

<style>
/* Fixing the scroll to top button position - bug since primevue v4.0.0 - something sets it to position 'relative' */
.p-scrolltop.p-button {
    position: fixed !important;
}
</style>
