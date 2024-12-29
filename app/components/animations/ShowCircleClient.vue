<template>
    <div class="relative" :class="containerClass">
        <div class="relative z-10">
            <slot />
        </div>

        <svg
            class="absolute left-0 bottom-0 w-full h-full stroke-current"
            :class="[strokeColor, isVisible ? (prefersReducedMotion ? 'no-animate-scribble' : 'animate-scribble') : '']"
            :viewBox="viewBox"
            preserveAspectRatio="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="500"
            :stroke-dashoffset="prefersReducedMotion ? '0' : '500'"
            :stroke-width="strokeWidth"
            :stroke-opacity="strokeOpacity"
            fill="none"
            aria-hidden="true"
        >
            <!-- <path d="M325,18C228.7-8.3,118.5,8.3,78,21C22.4,38.4,4.6,54.6,5.6,77.6c1.4,32.4,52.2,54,142.6,63.7 c66.2,7.1,212.2,7.5,273.5-8.3c64.4-16.6,104.3-57.6,33.8-98.2C386.7-4.9,179.4-1.4,126.3,20.7" /> -->
            <path d="M28.0001 9.50003C34 6.00006 75.5 1.18613e-05 107 1.99997C138.5 3.99993 167 7.00013 172.5 23.5001C178 40 127 49 83.0001 52C39.0002 55.0001 -2.49983 51.0001 4.50007 31.5001C11.5 12 93.5 1.60145 123 7.00001" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { useIsVisible } from '@/composables/useIsVisible'

const randomString = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
const containerClass = `container-${randomString}`

const { isVisible } = useIsVisible(`.${containerClass}`)

const strokeColor = 'text-rose-500'
const strokeWidth = 4
const strokeOpacity = 1

const viewBox = ref('0 0 176 55') // 0 0 176 55 - 0 0 500 150

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
</script>

<style scoped>
.animate-scribble {
    animation: scribble .8s ease-in forwards;
}

.no-animate-scribble {
    stroke-dashoffset: 0;
}

@keyframes scribble {
    0% {
        stroke-dashoffset: 500
    }

    to {
        stroke-dashoffset: 0
    }
}
</style>
