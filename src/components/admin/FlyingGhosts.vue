<template>
    <div ref="ghostContainer" class="absolute inset-0 w-full h-full">
        <img
            v-for="(ghost, index) in ghosts"
            :key="index"
            :src="ghost.src"
            class="absolute"
            :class="ghost.class"
            :style="{
                left: ghost.left + 'px',
                top: ghost.top + 'px',
                width: ghost.size + 'px',
                height: ghost.size + 'px',
                opacity: ghost.opacity
            }"
        >
    </div>
</template>

<script setup lang="ts">
import ghost1 from '@/assets/img/ghosts/—Pngtree—cute ghost ghostly cute ghost_3933462.png'
import ghost2 from '@/assets/img/ghosts/[CITYPNG.COM]PNG Cute Boo Ghost Crying Cartoon - 2000x2000.png'
import ghost3 from '@/assets/img/ghosts/pngegg.png'
import ghost4 from '@/assets/img/ghosts/transparent-ghost-649d5dde644a98.4761668616880347824108.png'

interface Ghost {
    src: string;
    left: number;
    top: number;
    opacity: number;
    size: number;
    class: string;
    intervalRef: ReturnType<typeof setInterval> | null;
}

const ghostContainer = ref<HTMLElement | null>(null)
const containerWidth = ref<number>(ghostContainer.value?.clientWidth ?? 0)
const containerHeight = ref<number>(ghostContainer.value?.clientHeight ?? 0)

const ghosts = ref<Ghost[]>([
    { src: ghost1, left: 0, top: 0, opacity: 0, size: 0, class: '', intervalRef: null },
    { src: ghost2, left: 0, top: 0, opacity: 0, size: 0, class: '', intervalRef: null },
    { src: ghost3, left: 0, top: 0, opacity: 0, size: 0, class: '', intervalRef: null },
    { src: ghost4, left: 0, top: 0, opacity: 0, size: 0, class: '', intervalRef: null }
])

const setSizes = () => {
    containerWidth.value = ghostContainer.value?.clientWidth ?? 0
    containerHeight.value = ghostContainer.value?.clientHeight ?? 0
}

// Start and stop animation
const startAnimation = () => ghosts.value.forEach((ghost) => animateGhost(ghost))
const stopAnimation = () => ghosts.value.forEach((ghost) => {
    resetGhost(ghost)
    if (ghost.intervalRef) clearInterval(ghost.intervalRef)
})

// Animate ghost
const animateGhost = (ghost: Ghost) => {
    // Set sizes
    setSizes()

    const randomDuration = Math.random() * 5000 + 1000
    ghost.intervalRef = setInterval(() => {
        // Add transition class to animate ghost
        ghost.class = 'transition-all duration-1000 ease-in-out animate-pulse'

        const deltaX = Math.random() * 100 - 50 // Random horizontal movement
        const deltaY = Math.random() * 100 - 50 // Random vertical movement

        ghost.left = Math.min(Math.max(ghost.left + deltaX, 0), containerWidth.value - ghost.size)
        ghost.top = Math.min(Math.max(ghost.top + deltaY, 0), containerHeight.value - ghost.size)

        ghost.size = Math.random() * 100 + 50
        ghost.opacity = 1

        // Set Timeout to reset ghost
        setTimeout(() => {
            resetGhost(ghost)
        }, 1000)
    }, randomDuration)
}


// Reset ghost
const resetGhost = (ghost: Ghost) => {
    ghost.opacity = 0

    // Remove transition class to reset ghost position
    ghost.class = 'transition-none duration-1000 ease-in-out'

    ghost.left = Math.random() * (containerWidth.value - ghost.size)
    ghost.top = Math.random() * (containerHeight.value - ghost.size)
    ghost.size = Math.random() * 100 + 50
}

onMounted(() => {
    setSizes() // Set initial sizes
    stopAnimation() // Stop animating ghosts
    startAnimation() // Start animating ghosts
})
</script>
