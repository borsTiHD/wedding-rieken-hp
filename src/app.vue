<template>
    <div class="app-wrapper">
        <Toast position="bottom-right" />
        <LoadingOverlay v-if="loading" :progress="progress" />
        <main v-else>
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import useLoadingSpinner from '@/composables/useLoadingSpinner'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// Props for 'loading' and 'progress'
// Also starts loading spinner
const { loading, progress, stoptLoading } = useLoadingSpinner(true)

// Stores
const appStore = useAppStore() // App store
const userStore = useUserStore() // User store

onMounted(async() => {
    await userStore.fetchUserData().catch(() => false) // Fetch user data, don't need to handle error
    await appStore.fetchConfig().catch(() => false) // Fetch app config, don't need to handle error
    stoptLoading() // Stop loading spinner
})
</script>

<style>
/* body {
    background-color: #1F2937;
    color: #fff;
} */
</style>
