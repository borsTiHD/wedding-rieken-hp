<template>
    <div v-if="!countdownFinished" class="flex justify-around text-xl w-full">
        <div class="text-center">
            <div class="text-3xl font-bold">{{ days }}</div>
            <div class="text-sm">{{ t('countdown.days', days) }}</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ hours }}</div>
            <div class="text-sm">{{ t('countdown.hours', hours) }}</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ minutes }}</div>
            <div class="text-sm">{{ t('countdown.minutes', minutes) }}</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ seconds }}</div>
            <div class="text-sm">{{ t('countdown.seconds', seconds) }}</div>
        </div>
    </div>

    <!-- Wedding is running / over -->
    <div v-else-if="weedingRunning" class="text-3xl font-bold">{{ t('countdown.zero') }}</div>
    <div v-else class="text-3xl font-bold">{{ t('countdown.over') }}</div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const props = defineProps<{
    timestamp?: number
}>()

// Localisation
const { t } = useI18n()

// App config
const appStore = useAppStore()
const weddingDuration = computed(() => appStore.weddingDuration)

// Refs
const interval = ref<null | ReturnType<typeof setInterval>>(null) // Interval for updating countdown
const timeLeft = ref(0) // Time left in seconds or negative

// Countdown states
const countdownFinished = computed(() => days.value <= 0 && hours.value <= 0 && minutes.value <= 0 && seconds.value <= 0) // True if countdown is zero or negative
const weedingRunning = computed(() => Math.floor((timeLeft.value % 86400) / 3600) >= -1 * weddingDuration.value) // True if wedding is still running

// Countdown values
const days = computed(() => Math.floor(timeLeft.value / 86400))
const hours = computed(() => Math.floor((timeLeft.value % 86400) / 3600))
const minutes = computed(() => Math.floor((timeLeft.value % 3600) / 60))
const seconds = computed(() => timeLeft.value % 60)

// Update countdown values
const updateCountdown = () => {
    // Return if timestamp is undefined
    if (!props.timestamp) return

    const currentTime = Math.floor(Date.now() / 1000)
    timeLeft.value = props.timestamp - currentTime
}

onMounted(() => {
    updateCountdown()
    if (interval.value) { clearInterval(interval.value) }
    interval.value = setInterval(updateCountdown, 1000)
})
</script>
