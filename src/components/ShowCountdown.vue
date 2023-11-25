<template>
    <div class="flex justify-around text-xl w-full">
        <div class="text-center">
            <div class="text-3xl font-bold">{{ days }}</div>
            <div class="text-sm">{{ t('countdown.days') }}</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ hours }}</div>
            <div class="text-sm">{{ t('countdown.hours') }}</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ minutes }}</div>
            <div class="text-sm">{{ t('countdown.minutes') }}</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ seconds }}</div>
            <div class="text-sm">{{ t('countdown.seconds') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    timestamp?: number
}>()

// TODO: Show a message when the countdown is over

// Localisation
const { t } = useI18n()

// Countdown values
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const interval = ref<null | ReturnType<typeof setInterval>>(null)

// Update countdown values
const updateCountdown = () => {
    // Return if timestamp is undefined
    if (!props.timestamp) return

    const currentTime = Math.floor(Date.now() / 1000)
    const timeLeft = props.timestamp - currentTime

    if (timeLeft <= 0) {
        days.value = 0
        hours.value = 0
        minutes.value = 0
        seconds.value = 0
    } else {
        days.value = Math.floor(timeLeft / 86400)
        hours.value = Math.floor((timeLeft % 86400) / 3600)
        minutes.value = Math.floor((timeLeft % 3600) / 60)
        seconds.value = timeLeft % 60
    }
}

onMounted(() => {
    updateCountdown()
    if (interval.value) { clearInterval(interval.value) }
    interval.value = setInterval(updateCountdown, 1000)
})
</script>
