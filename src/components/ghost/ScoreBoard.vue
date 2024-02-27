<template>
    <div v-if="show" class="relative mb-auto mt-8 p-4 bg-white rounded-xl flex flex-col justify-between items-center gap-2">
        <span class="text-2xl">Score: {{ props.score }}</span>
        <span class="text-2xl">Time: {{ props.timer }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    score: number,
    timer: number // in seconds
}>()

const show = computed(() => props.score > 0 && props.timer > 0)
</script>
