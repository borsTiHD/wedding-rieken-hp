<template>
    <Card class="card-primary">
        <template #content>
            <div class="flex flex-col gap-4">
                <ShowCountdown :timestamp="config?.weddingDate" />
                <DateDisplay :timestamp="config?.weddingDate" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'

// Fetch app config
const appStore = useAppStore()
const config = appStore.config
</script>
