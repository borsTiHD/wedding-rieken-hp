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
import { useAppStore } from '@/stores/app'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import useLoadingSpinner from '@/composables/useLoadingSpinner'

// Props for 'loading' and 'progress'
// Also starts loading spinner
const { loading, progress, stoptLoading } = useLoadingSpinner(true)

// App store
const appStore = useAppStore()

onMounted(async() => {
    await appStore.fetchConfig() // Fetch app config
    stoptLoading() // Stop loading spinner
})
</script>

<style>
/* body {
    background-color: #1F2937;
    color: #fff;
} */
</style>
