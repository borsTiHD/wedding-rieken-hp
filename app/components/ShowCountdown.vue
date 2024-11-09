<template>
    <!-- Countdown is not updated yet -->
    <span v-if="!updated" class="text-3xl font-bold">-</span>

    <!-- Countdown is running -->
    <div v-else-if="!countdownFinished" class="flex justify-around text-xl w-full">
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
import { useConfig } from '@/composables/useConfig'

const props = defineProps<{
    timestamp?: number
}>()

// Localisation
const { t } = useI18n()

// Config
const { weddingDuration } = useConfig()

// Refs
const updated = ref(false) // True if countdown was updated
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
    updated.value = true
}

onMounted(() => {
    updateCountdown()
    if (interval.value) { clearInterval(interval.value) }
    interval.value = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
    if (interval.value) { clearInterval(interval.value) }
})
</script>
