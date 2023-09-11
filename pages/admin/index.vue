<template>
    <div class="m-4 flex flex-col gap-4">
        <ShowCountdown :timestamp="config?.weddingDate" />
        <DateDisplay :timestamp="config?.weddingDate" />
        <ChangeTimestamp />
        <ApiTesting />
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ChangeTimestamp from '~/components/admin/ChangeTimestamp.vue'
import ApiTesting from '@/components/ApiTesting.vue'

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)
</script>
