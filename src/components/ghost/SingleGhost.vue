<template>
    <HitMarker ref="hitMarkerRef" />
    <img
        :src="image"
        class="absolute transition-all ease-in-out duration-150 cursor-crosshair"
        :class="{ 'transform -scale-x-100': facing === 'left' }"
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
import ghost1 from '@/assets/img/ghosts/—Pngtree—cute ghost ghostly cute ghost_3933462.png'
import ghost2 from '@/assets/img/ghosts/[CITYPNG.COM]PNG Cute Boo Ghost Crying Cartoon - 2000x2000.png'
import ghost3 from '@/assets/img/ghosts/pngegg.png'
import ghost4 from '@/assets/img/ghosts/transparent-ghost-649d5dde644a98.4761668616880347824108.png'
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
const ghostImages: string[] = [ghost1, ghost2, ghost3, ghost4]
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
    return {
        horizontal: checkLeft < 0 + size.value + padding // left
            || checkLeft + size.value + padding > containerWidth.value, // right
        vertical: checkTop < 0 + size.value + padding // top
            || checkTop + size.value + padding > containerHeight.value // bottom
    }
}

// Ghost hit by a mouse click
function hit() {
    // Show hit marker
    hitMarkerRef.value?.hit({
        x: left.value - 10,
        y: (top.value + size.value / 2) - 60
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
watch(() => props.settings, (newSettings) => {
    if (newSettings) {
        if (newSettings.containerWidth && newSettings.containerHeight) {
            setContainerSize(newSettings.containerWidth, newSettings.containerHeight)
        }
        if (newSettings.size) { size.value = newSettings.size }
        if (newSettings.speed) { speed.value = newSettings.speed }
        if (newSettings.duration) { duration.value = newSettings.duration }
        if (newSettings.ghost) { image.value = ghostImages[newSettings.ghost - 1] }

        // Set random position if the container size changes to avoid ghost being stuck outside the container
        setRandomPosition()
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
