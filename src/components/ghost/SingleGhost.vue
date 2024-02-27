<template>
    <HitMarker ref="hitMarkerRef" />
    <img
        :src="image"
        class="absolute transition-all ease-in-out duration-150 cursor-crosshair select-none hover:opacity-100"
        :class="{ 'transform -scale-x-100': facing === 'right' }"
        :style="{
            left: left + 'px',
            top: top + 'px',
            width: size + 'px',
            height: size + 'px',
            opacity: opacity
        }"
        @click="hit"
    >
</template>

<script setup lang="ts">
import ghost1 from '@/assets/img/ghosts/ghost1.png'
import ghost2 from '@/assets/img/ghosts/ghost2.png'
import ghost3 from '@/assets/img/ghosts/ghost3.png'
import ghost4 from '@/assets/img/ghosts/ghost4.png'
import ghost5 from '@/assets/img/ghosts/ghost5.png'
import ghost6 from '@/assets/img/ghosts/ghost6.png'
import ghost7a from '@/assets/img/ghosts/ghost7-1.png'
import ghost7b from '@/assets/img/ghosts/ghost7-2.png'
import ghost7c from '@/assets/img/ghosts/ghost7-3.png'
import ghost7d from '@/assets/img/ghosts/ghost7-4.png'
import ghost7e from '@/assets/img/ghosts/ghost7-5.png'
import ghost7f from '@/assets/img/ghosts/ghost7-6.png'
import ghost8 from '@/assets/img/ghosts/ghost8.png'
import ghost9 from '@/assets/img/ghosts/ghost9.png'
import ghost10 from '@/assets/img/ghosts/ghost10.png'
import ghost11 from '@/assets/img/ghosts/ghost11.png'
import ghost12 from '@/assets/img/ghosts/ghost12.png'
import ghost13 from '@/assets/img/ghosts/ghost13.png'
import ghost14 from '@/assets/img/ghosts/ghost14.png'
import ghost15 from '@/assets/img/ghosts/ghost15.png'
import ghost16 from '@/assets/img/ghosts/ghost16.png'
import ghost17 from '@/assets/img/ghosts/ghost17.png'
import ghost18 from '@/assets/img/ghosts/ghost18.png'
import ghost19 from '@/assets/img/ghosts/ghost19.png'
import ghost20 from '@/assets/img/ghosts/ghost20.png'
import ghost21 from '@/assets/img/ghosts/ghost21.png'

import HitMarker from '@/components/ghost/HitMarker.vue'

export type GhostSetting = {
    containerWidth: number
    containerHeight: number
    size?: number
    speed?: number
    duration?: number // in milliseconds
    ghost?: number // Choose a ghost image
}

const props = defineProps<{
    settings: GhostSetting
}>()

// Hit marker ref
const hitMarkerRef = ref<InstanceType<typeof HitMarker> | null>(null)

// Ghost images
const ghostImages: string[] = [
    ghost1, ghost2, ghost3, ghost4, ghost5, ghost6, ghost7a, ghost7b, ghost7c, ghost7d, ghost7e, ghost7f, ghost8, ghost9, ghost10,
    ghost11, ghost12, ghost13, ghost14, ghost15, ghost16, ghost17, ghost18, ghost19, ghost20, ghost21
]
const image = ref<string>('')

// Container sizes
const containerWidth = ref<number>(props.settings.containerWidth)
const containerHeight = ref<number>(props.settings.containerHeight)

// Ghost settings
const interval = ref<ReturnType<typeof setInterval> | null>(null)
const duration = ref<number>(props.settings.duration ?? 1000) // in milliseconds
const left = ref<number>(0)
const top = ref<number>(0)
const size = ref<number>(props.settings.size ?? 0)
const speed = ref<number>(0)
const opacity = ref<number>(0)
const facing = ref<'left' | 'right'>('right')
const direction = ref<'up' | 'down'>('down')
const multiplier = ref<number>(1)

// Hitting edge of the container counter
const edgeCounter = ref<number>(0)

// Set random size, speed, and opacity if not provided
if (size.value === 0) { setRandomSize() }
if (speed.value === 0) { setRandomSpeed() }
if (opacity.value === 0) { changeOpacityRandomly() }

// Set default position and facing
setRandomPosition()
setRandomFacing()
setRandomDirection()

// Define ghost image based on settings or random
if (props.settings?.ghost) {
    image.value = ghostImages[props.settings.ghost - 1]
} else {
    image.value = ghostImages[Math.floor(Math.random() * ghostImages.length)]
}

// Sets a random size
function setRandomSize() {
    size.value = Math.floor(Math.random() * 100) + 50
}

// Sets a random position
function setRandomPosition() {
    let newLeft = Math.floor(Math.random() * containerWidth.value - size.value)
    let newTop = Math.floor(Math.random() * containerHeight.value - size.value)

    // Check if the new position is not too close to the edge
    // Set position to the middle of the container
    if (isCloseToEdge(newLeft, newTop).horizontal) { newLeft = containerWidth.value / 2 - size.value / 2 }
    if (isCloseToEdge(newLeft, newTop).vertical) { newTop = containerHeight.value / 2 - size.value / 2 }

    // Set new position
    left.value = newLeft
    top.value = newTop
}

// Sets a random horizontal direction
function setRandomFacing() {
    facing.value = Math.random() > 0.5 ? 'left' : 'right'
}

// Sets a random vertical direction
function setRandomDirection() {
    direction.value = Math.random() > 0.5 ? 'up' : 'down'
}

// Sets a random speed
function setRandomSpeed() {
    speed.value = Math.random() * 2 + 1
}

// Change speed randomly
function changeSpeedRandomly() {
    const maxSpeed = 10
    const minSpeed = 1

    // Set acceleration or deceleration
    if (randomBoolean(50)) {
        speed.value += Math.random() * 2 + 1
    } else {
        speed.value -= Math.random() * 2 + 1
    }

    // Pay attention to the maximum and minimum speed
    if (speed.value > maxSpeed) { speed.value = maxSpeed - 1 }
    if (speed.value < minSpeed) { speed.value = minSpeed + 1 }
}

// Change opacity randomly
function changeOpacityRandomly() {
    const maxOpacity = 1
    const minOpacity = 0.1

    // Add or remove opacity randomly
    if (randomBoolean(50)) {
        opacity.value += Math.random()
    } else {
        opacity.value -= Math.random()
    }

    // Pay attention to the maximum and minimum opacity
    if (opacity.value > maxOpacity) { opacity.value = maxOpacity - 0.1 }
    if (opacity.value < minOpacity) { opacity.value = minOpacity + 0.1 }
}

// Random boolean for x% chance of getting true
// Default percentage is 1%
// Multiplier is used to increase or decrease the chance
function randomBoolean(percentage = 1) {
    return Math.random() < percentage * multiplier.value / 100
}

// Check if ghost is moving to close to the edge
function isCloseToEdge(newLeft?: number, newTop?: number) {
    const checkLeft = newLeft ?? left.value
    const checkTop = newTop ?? top.value

    // Set padding for the container
    const padding = 10

    const check = {
        horizontal: checkLeft < 0 + padding // left
            || checkLeft + size.value + padding > containerWidth.value, // right
        vertical: checkTop < 0 + padding // top
            || checkTop + size.value + padding > containerHeight.value // bottom
    }

    // Increase the edge counter if the ghost is close to the edge
    if (check.horizontal || check.vertical) {
        edgeCounter.value++

        // Check if the ghost is stuck at the edge
        if (edgeCounter.value > 10) {
            setRandomPosition()
            edgeCounter.value = 0
        }
    }

    return check
}

// Ghost hit by a mouse click
function hit(event: MouseEvent) {
    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    }

    // Show hit marker
    hitMarkerRef.value?.hit({
        x: mousePosition.x - 35,
        y: mousePosition.y - 80
    })

    // Opacity is set to 0 to make the ghost transparent
    opacity.value = 0

    // Set new random size, speed, and position
    setRandomSize()
    setRandomSpeed()
    setRandomPosition()

    // Stop moving the ghost
    stopMoving()

    // Start moving the ghost again after a short delay
    setTimeout(() => {
        startMoving()
    }, 1000)

    // Emits a hit event
    emit('hit')
}

// Move the ghost
function move() {
    // Check if the ghost is close to the horizontal edge
    // Change direction if the ghost is close to the edge
    // If not close to the edge, randomly change direction
    if (isCloseToEdge().horizontal) {
        facing.value = facing.value === 'right' ? 'left' : 'right'
    } else if (randomBoolean()) {
        facing.value = facing.value === 'right' ? 'left' : 'right'
    }

    // Check if the ghost is close to the vertical edge
    // Change direction if the ghost is close to the edge
    // If not close to the edge, randomly change direction
    if (isCloseToEdge().vertical) {
        direction.value = direction.value === 'down' ? 'up' : 'down'
    } else if (randomBoolean()) {
        direction.value = direction.value === 'down' ? 'up' : 'down'
    }

    // Move the ghost to the right or left with random speed
    if (randomBoolean(10)) { changeSpeedRandomly() }
    if (facing.value === 'right') {
        left.value += speed.value
    } else {
        left.value -= speed.value
    }

    // Move the ghost up or down with random speed
    if (randomBoolean(10)) { changeSpeedRandomly() }
    if (direction.value === 'down') {
        top.value += speed.value
    } else {
        top.value -= speed.value
    }

    // Set random opacity
    if (randomBoolean(10)) { changeOpacityRandomly() }
}

// Set container size
function setContainerSize(newWidth: number, newHeight: number) {
    containerWidth.value = newWidth
    containerHeight.value = newHeight
}

// Start moving the ghost
function startMoving() {
    move() // Move the ghost immediately
    interval.value = setInterval(() => {
        move()
    }, duration.value)
}

// Stop moving the ghost
function stopMoving() {
    if (interval.value) { clearInterval(interval.value) }
}

// Watch settings for changes
watch(() => props.settings, (newSettings, old) => {
    if (newSettings) {
        if (
            newSettings.containerWidth && newSettings.containerHeight
            && (newSettings.containerWidth !== old.containerWidth || newSettings.containerHeight !== old.containerHeight)
        ) {
            setContainerSize(newSettings.containerWidth, newSettings.containerHeight)

            // Set random position if the container size changes
            // to avoid ghost being stuck outside the container
            setRandomPosition()
        }
        if (newSettings.size) { size.value = newSettings.size }
        if (newSettings.speed) { speed.value = newSettings.speed }
        if (newSettings.duration) { duration.value = newSettings.duration }
        if (newSettings.ghost) { image.value = ghostImages[newSettings.ghost - 1] }
    }
}, { deep: true })

// Emit events
const emit = defineEmits(['hit'])

// Expose start and stop moving functions
defineExpose({
    setContainerSize,
    startMoving,
    stopMoving
})

// Start moving the ghost
startMoving()
</script>
