<template>
    <div class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-opacity-70 bg-gray-800 z-50">
        <div class="relative h-16 w-16">
            <div class="animate-spin rounded-full h-full w-full border-t-4 border-blue-500" />
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                {{ props.progress }}%
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Props for 'progress'
const props = defineProps({
    progress: {
        type: Number,
        default: 0
    }
})
</script>
