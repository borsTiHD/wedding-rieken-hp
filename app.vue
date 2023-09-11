<template>
    <div class="app-wrapper">
        <LoadingOverlay v-if="loading" :progress="progress" />
        <main v-else>
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import useLoadingSpinner from '@/composables/useLoadingSpinner'

// Props for 'loading' and 'progress'
const { loading, progress } = useLoadingSpinner(true)

// Fetch app config
const appStore = useAppStore()
await appStore.fetchConfig()
const config = appStore.config

console.log('App config:', config)
console.log('Config - Wedding Date:', config?.weddingDate)
</script>

<style>
/* body {
    background-color: #1F2937;
    color: #fff;
} */
</style>
