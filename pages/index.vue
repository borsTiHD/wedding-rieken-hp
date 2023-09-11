<template>
    <div class="m-4 flex flex-col gap-4">
        <ShowCountdown :timestamp="config?.weddingDate" />
        <DateDisplay :timestamp="config?.weddingDate" />
        <ApiTesting />
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ApiTesting from '@/components/ApiTesting.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'

// Fetch app config
const appStore = useAppStore()
const config = appStore.config
</script>
