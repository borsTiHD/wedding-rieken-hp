<template>
    <div ref="emojiFallContainer" class="emoji-fall-container pointer-events-none">
        <div
            v-for="emoji in emojis"
            :key="emoji.id"
            class="emoji cursor-pointer select-none"
            :style="emoji.style"
            @mousedown="popEmoji(emoji)"
        >
            {{ emoji.char }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type CSSProperties } from 'vue'

interface Emoji {
    id: number
    char: string
    style: CSSProperties
}

const emojiFallContainer = ref<HTMLElement | null>(null)
const interval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
const emojis = ref<Emoji[]>([])

// Generate random emojis
const generateEmoji = () => {
    const emojiChars = ['❤️', '💍', '💐', '🎵', '❓', '🎉', '🥂', '👰', '🤵', '💒', '🎂', '💌', '🚗']
    const duration = Math.random() * 10 + 6 // Fall duration between 6 and 16 seconds
    const emoji: Emoji = {
        id: Date.now() + Math.random(),
        char: emojiChars[Math.floor(Math.random() * emojiChars.length)] || '❤️',
        style: {
            position: 'absolute',
            top: '-50px',
            left: `${Math.random() * 100}vw`,
            fontSize: `${Math.random() * 24 + 16}px`,
            animationDuration: `${duration}s`, // Fall duration
            opacity: Math.random() * 0.5 + 0.5,
            transform: 'translateY(0)',
            transition: 'opacity 1s, transform 1s',
            '--random-translate-x': `${Math.random() * 20 - 10}vw`,
            '--initial-rotate': `${Math.random() * 360}deg`,
            '--rotate-direction': Math.random() > 0.5 ? '1' : '-1'
        } as CSSProperties
    }
    emojis.value.push(emoji)

    // Change opacity to 0 before the animation ends
    setTimeout(() => {
        if (emoji) { emoji.style.opacity = 0 }
    }, (duration - 2) * 1000)

    // Remove the emoji after the animation ends
    const removeEmoji = () => {
        emojis.value = emojis.value.filter((e) => e.id !== emoji.id)
    }

    // Add event listener for animation end
    const emojiElement = document.querySelector(`[key="${emoji.id}"]`)
    if (emojiElement) {
        emojiElement.addEventListener('animationend', removeEmoji)
    }
}

const resizeContainer = () => {
    if (emojiFallContainer.value) {
        emojiFallContainer.value.style.height = `${document.body.scrollHeight}px`
    }
}

onMounted(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
        interval.value = setInterval(generateEmoji, 1000)
    }

    // Resize container on mount and on resize
    resizeContainer()
    window.addEventListener('resize', resizeContainer)

    // Resize container once more after 2 seconds
    setTimeout(resizeContainer, 2000)
})

onUnmounted(() => {
    if (interval.value !== undefined) {
        clearInterval(interval.value)
    }
    window.removeEventListener('resize', resizeContainer)
})

const popEmoji = (emoji: Emoji) => {
    emoji.style.transform = 'scale(2) rotate(360deg)'
    emoji.style.opacity = 0
    emoji.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.5)'
    setTimeout(() => {
        emojis.value = emojis.value.filter((e) => e.id !== emoji?.id)
    }, 300)
}
</script>

<style scoped>
.emoji-fall-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    background-attachment: fixed;
}

.emoji {
    animation: fall linear infinite;
    transition: transform 0.3s, opacity 0.3s, color 0.3s;
    pointer-events: auto;
}

@keyframes fall {
    to {
        transform: translateY(200vh) translateX(var(--random-translate-x)) rotate(calc(var(--initial-rotate) * var(--rotate-direction)));
    }
}

@keyframes fadeOut {
    to {
        opacity: 0;
    }
}

/* Disable animations if user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
    .emoji {
        animation: none;
    }
}
</style>
