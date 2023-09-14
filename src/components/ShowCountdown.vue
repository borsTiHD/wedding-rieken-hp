<template>
    <div class="flex justify-around text-xl">
        <div class="text-center">
            <div class="text-3xl font-bold">{{ days }}</div>
            <div class="text-sm">Tage</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ hours }}</div>
            <div class="text-sm">Stunden</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ minutes }}</div>
            <div class="text-sm">Minuten</div>
        </div>
        <div class="text-center">
            <div class="text-3xl font-bold">{{ seconds }}</div>
            <div class="text-sm">Sekunden</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    timestamp: {
        type: Number,
        default: 0
    }
})

// Countdown values
const targetDate = ref(0)
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const interval = ref<null | ReturnType<typeof setInterval>>(null)

// Update countdown values
const updateCountdown = () => {
    const currentTime = Math.floor(Date.now() / 1000)
    const timeLeft = targetDate.value - currentTime

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

// Watch for changes in timestamp
watch(() => props.timestamp, () => {
    targetDate.value = props.timestamp
})

onMounted(() => {
    // Set initial timestamp in seconds
    targetDate.value = props.timestamp

    updateCountdown()
    if (interval.value) { clearInterval(interval.value) }
    interval.value = setInterval(updateCountdown, 1000)
})
</script>
