<script setup lang="ts">
import { useIsVisible } from '@/composables/useIsVisible'

interface Props {
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'text-lime-500',
})

const randomString = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
const containerClass = `container-${randomString}`

const { isVisible } = useIsVisible(`.${containerClass}`)

const marginOffset = 'mt-2'
const strokeColor = props.color
const strokeWidth = 34
const strokeOpacity = 0.4

const viewBox = ref('0 0 500 180') // 0 0 176 55 - 0 0 500 150

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
</script>

<template>
  <div class="relative" :class="containerClass">
    <div class="relative z-10">
      <slot />
    </div>

    <svg
      class="absolute left-0 top-0 w-full h-full stroke-current"
      :class="[marginOffset, strokeColor, isVisible ? (prefersReducedMotion ? 'no-animate-scribble' : 'animate-scribble') : '']"
      :viewBox="viewBox"
      preserveAspectRatio="none"
      stroke-linecap="butt"
      stroke-linejoin="round"
      stroke-dasharray="500"
      :stroke-dashoffset="prefersReducedMotion ? '0' : '500'"
      :stroke-width="strokeWidth"
      :stroke-opacity="strokeOpacity"
      fill="none"
      aria-hidden="true"
    >
      <!-- Smoother paths -->
      <!-- <path d="M10 130 Q 120 150, 230 130 T 450 130" /> -->
      <!-- <path d="M20 130 C 70 100, 130 160, 190 130 S 270 100, 330 130 S 400 160, 460 130" /> -->
      <!-- <path d="M10 120 Q 50 130, 90 120 T 170 120 Q 200 110, 230 120 T 310 120 Q 340 130, 370 120 T 450 120" /> -->
      <!-- <path d="M10 120 C 50 125, 100 115, 150 120 S 250 125, 300 120 S 400 115, 450 120" /> -->
      <!-- <path d="M10 110 Q 80 140, 150 110 T 290 110 Q 350 140, 410 110 T 490 110" /> -->

      <!-- Zigzag paths -->
      <!-- <path d="M10 50 L 80 20 L 150 50 L 220 20 L 290 50 L 360 20 L 430 50 L 500 20" /> -->
      <!-- <path d="M10 100 L 60 30 L 120 80 L 180 30 L 240 100 L 300 50 L 360 100 L 420 30 L 480 100" /> -->
      <!-- <path d="M10 80 L 60 120 L 110 70 L 160 120 L 210 50 L 260 120 L 310 70 L 360 120 L 410 80" /> -->

      <!-- Soft wavy pattern -->
      <!-- <path d="M10 135 Q 60 145, 110 135 T 210 135 T 310 135 T 410 135 T 510 135" /> -->

      <!-- Steeper wave pattern - viewBox: '0 0 500 180' -->
      <!-- <path d="M10 130 C 60 180, 160 80, 210 130 S 360 180, 410 130 S 560 80, 610 130" /> -->

      <!-- Steeper wave pattern - viewBox: '0 0 500 170' -->
      <path d="M10 130 C 60 150, 160 110, 210 130 S 360 150, 410 130 S 560 110, 610 130" />

      <!-- Gentle wave pattern -->
      <!-- <path d="M10 140 C 60 150, 110 130, 160 140 S 260 150, 310 140 S 410 130, 460 140 S 560 150, 610 140" /> -->
    </svg>
  </div>
</template>

<style scoped>
.animate-scribble {
    animation: scribble 0.5s ease-in forwards;
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
