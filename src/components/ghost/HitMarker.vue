<template>
    <span
        v-if="show"
        class="absolute wobble-hor-bottom bg-red-500/80 text-white p-2 rounded-md select-none"
        :style="{
            left: left + 'px',
            top: top + 'px',
        }"
    >+1 score</span>
</template>

<script setup lang="ts">
export type Position = {
    x: number
    y: number
}

const show = ref<boolean>(false)
const left = ref<number>(0)
const top = ref<number>(0)

const hit = (position: Position) => {
    left.value = position.x
    top.value = position.y
    show.value = true

    setTimeout(() => {
        show.value = false
    }, 1000)
}

// Expose the hit function
defineExpose({ hit })
</script>
