<template>
    <div ref="ghostContainer" class="absolute inset-0 flex justify-center w-full h-full bg-black/50 z-40">
        <ScoreBoard :score="highScore" :timer="currentGameTime" />
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
            @hit="hit"
        />
    </div>
</template>

<script setup lang="ts">
import SingleGhost from '@/components/ghost/SingleGhost.vue'
import ScoreBoard from '@/components/ghost/ScoreBoard.vue'
import type { GhostSetting } from '@/components/ghost/SingleGhost.vue'

interface Ghost extends GhostSetting {
    id: number
    itemRef: Element | ComponentPublicInstance | null
}

// Game boundaries
const ghostContainer = ref<HTMLElement | null>(null)
const containerWidth = ref<number>(ghostContainer.value?.clientWidth ?? 0)
const containerHeight = ref<number>(ghostContainer.value?.clientHeight ?? 0)

// Game state
const running = ref<boolean>(false)
const highScore = ref<number>(0)
const maxGameTime = 20 // in seconds
const currentGameTime = ref<number>(0)

const ghosts = ref<Ghost[]>([])

// Game start
const gameStart = () => {
    // Reset the game
    gameReset()

    // Set the game to running state and reset the game time
    running.value = true

    // Add initial 10 ghosts
    for (let i = 0; i < 10; i++) {
        addingGhost()
    }

    // Start the game timer
    const timer = setInterval(() => {
        currentGameTime.value--

        if (currentGameTime.value <= 0) {
            running.value = false
            clearInterval(timer)

            // Remove all ghosts
            ghosts.value = []

            // Add initial ghost
            // Hitting the first ghost will start the game
            addingGhost()

            console.log('Game over - Score:', highScore.value)
        }
    }, 1000)
}

// Reset the game
const gameReset = () => {
    running.value = false
    highScore.value = 0
    currentGameTime.value = maxGameTime
    ghosts.value = [] // Remove all ghosts
    addingGhost() // Add initial ghost
}

// Add a ghost
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

// Ghost hit
const hit = () => {
    // If the game is not running,
    // hitting the first ghost will start the game
    if (!running.value) {
        gameStart()
    }

    // Increase the high score
    highScore.value++
}

// Set container sizes
const setSizes = () => {
    containerWidth.value = ghostContainer.value?.clientWidth ?? 0
    containerHeight.value = ghostContainer.value?.clientHeight ?? 0
}

// Set new sizes and update the ghosts boundaries
const setNewSizes = () => {
    setSizes()
    ghosts.value.forEach((ghost) => {
        ghost.containerWidth = containerWidth.value
        ghost.containerHeight = containerHeight.value
    })
}

onMounted(() => {
    // Set initial sizes
    setSizes()

    // Reset the game
    gameReset()

    // On window resize, set sizes
    window.addEventListener('resize', setNewSizes)
})
</script>
