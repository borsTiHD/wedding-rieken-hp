<template>
    <div ref="ghostContainer" class="absolute inset-0 w-full h-full bg-black/50 z-40">
        <SingleGhost
            v-for="(ghost, index) in ghosts"
            :ref="el => ghost.itemRef = el"
            :key="index"
            :settings="{
                containerWidth: containerWidth,
                containerHeight: containerHeight,
                size: ghost.size,
                speed: ghost.speed,
                duration: ghost.duration,
                ghost: ghost.ghost
            }"
            @hit="hit(ghost)"
        />
    </div>
</template>

<script setup lang="ts">
import SingleGhost from '@/components/ghost/SingleGhost.vue'
import type { GhostSetting } from '@/components/ghost/SingleGhost.vue'

interface Ghost extends GhostSetting {
    id: number
    itemRef: Element | ComponentPublicInstance | null
}

const ghostContainer = ref<HTMLElement | null>(null)
const containerWidth = ref<number>(ghostContainer.value?.clientWidth ?? 0)
const containerHeight = ref<number>(ghostContainer.value?.clientHeight ?? 0)
const highScore = ref<number>(0)

const ghosts = ref<Ghost[]>([])

const addingGhost = (number?: number) => {
    // Create a random id
    const randomId = Math.floor(Math.random() * 1000)

    // Create a new ghost
    const ghost: Ghost = {
        id: randomId,
        itemRef: null,
        containerWidth: containerWidth.value,
        containerHeight: containerHeight.value,
        size: Math.floor(Math.random() * 100) + 50,
        duration: Math.floor(Math.random() * 500),
        ghost: number // Math.floor(Math.random() * 4) + 1
    }

    // Add the ghost to the ghosts array
    ghosts.value.push(ghost)
}

const setSizes = () => {
    containerWidth.value = ghostContainer.value?.clientWidth ?? 0
    containerHeight.value = ghostContainer.value?.clientHeight ?? 0
}

const setNewSizes = () => {
    setSizes()
    ghosts.value.forEach((ghost) => {
        ghost.containerWidth = containerWidth.value
        ghost.containerHeight = containerHeight.value
    })
}

// Ghost hit
const hit = (ghost: Ghost) => {
    // Increase the high score
    highScore.value++

    console.log('Hit', ghost.id)
    console.log('High score', highScore.value)
}

onMounted(() => {
    setSizes() // Set initial sizes

    // Add initial 10 ghosts
    for (let i = 0; i < 10; i++) {
        addingGhost()
    }

    // On window resize, set sizes
    window.addEventListener('resize', setNewSizes)
})
</script>
