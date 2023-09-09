<template>
    <div>
        <main>
            <NuxtPage />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
await appStore.fetchConfig()
const config = appStore.config

console.log('App config:', config)
console.log('Config - Wedding Date:', config?.weddingDate)
</script>

<style>
body {
    background-color: #1F2937;
    color: #fff;
}
</style>
