<template>
    <span class="text-2xl">{{ formattedDate }}</span>
</template>

<script setup lang="ts">
const props = defineProps({
    timestamp: {
        type: Number,
        default: 0
    }
})

// Format date based on timestamp
const formattedDate = computed(() => {
    if (!props.timestamp) return ''

    const date = new Date(props.timestamp * 1000) // Konvertiere Unix-Zeitstempel in Millisekunden
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    }

    return date.toLocaleString(undefined, options)
})
</script>
