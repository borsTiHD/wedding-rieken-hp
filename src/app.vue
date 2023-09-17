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
    await appStore.fetchConfig() // Fetch app config
    await userStore.fetchUserData() // Fetch user data
    stoptLoading() // Stop loading spinner
})
</script>

<style>
/* body {
    background-color: #1F2937;
    color: #fff;
} */
</style>
