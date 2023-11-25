<template>
    <span class="text-xl sm:text-2xl">{{ d(computedDate, 'long') }}</span>
</template>

<script setup lang="ts">
const { d } = useI18n()

const props = defineProps<{
    timestamp?: number
}>()

// Format date based on timestamp
const computedDate = computed(() => {
    if (!props.timestamp) return 0
    return new Date(props.timestamp * 1000) // Konvertiere Unix-Zeitstempel in Millisekunden
})
</script>
