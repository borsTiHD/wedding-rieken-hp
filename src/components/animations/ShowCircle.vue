<template>
    <div class="circle-container">
        <slot />
        <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path :class="animationPathClass" fill="none" d="M325,18C228.7-8.3,118.5,8.3,78,21C22.4,38.4,4.6,54.6,5.6,77.6c1.4,32.4,52.2,54,142.6,63.7 c66.2,7.1,212.2,7.5,273.5-8.3c64.4-16.6,104.3-57.6,33.8-98.2C386.7-4.9,179.4-1.4,126.3,20.7" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import useIntersectionEntry from '@/composables/useIntersectionEntry'

const randomClass = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
const animationPathClass = `animation-path-${randomClass}`

const { observedElement, elementClass, interOptions, observer } = useIntersectionEntry()

onMounted(() => {
    observedElement.value = document.querySelector(`.${animationPathClass}`)
    elementClass.value = 'run-animation'
    interOptions.value = {
        root: null,
        threshold: 0.5
    }
    if (observedElement.value) observer.observe(observedElement.value)
})
</script>

<style scoped>
.circle-container svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.circle-container path {
    stroke: #db3157;
    stroke-width: 8px;
    stroke-dasharray: 0 1500;
}

.run-animation {
    animation: draw 1s forwards;
}

@keyframes draw {
    from {
        stroke-dasharray: 0 1500;
    }

    to {
        stroke-dasharray: 1500 1500;
    }
}
</style>
