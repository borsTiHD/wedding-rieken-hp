<template>
    <div class="emoji-fall-container select-none">
        <div v-for="emoji in emojis" :key="emoji.id" class="emoji cursor-pointer" :style="emoji.style" @mousedown="popEmoji(emoji)">{{ emoji.char }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type CSSProperties } from 'vue'

interface Emoji {
    id: number
    char: string
    style: CSSProperties
}

const emojis = ref<Emoji[]>([])

// Generate random emojis
const generateEmoji = () => {
    const emojiChars = ['❤️', '💍', '💐', '🎵', '❓', '🎉', '🥂', '👰', '🤵', '💒', '🎂', '💌', '🚗']
    const emoji: Emoji = {
        id: Date.now() + Math.random(),
        char: emojiChars[Math.floor(Math.random() * emojiChars.length)] || '❤️',
        style: {
            position: 'absolute',
            top: '-50px',
            left: `${Math.random() * 100}vw`,
            fontSize: `${Math.random() * 24 + 16}px`,
            animationDuration: `${Math.random() * 5 + 3}s`,
            opacity: Math.random() * 0.5 + 0.5,
            transform: 'translateY(0)',
            transition: 'opacity 1s, transform 1s',
            '--random-translate-x': `${Math.random() * 20 - 10}vw`,
            '--initial-rotate': `${Math.random() * 360}deg`,
            '--rotate-direction': Math.random() > 0.5 ? '1' : '-1'
        } as CSSProperties
    }
    emojis.value.push(emoji)

    // Set a timeout to remove the emoji after a random time between 5 and 10 seconds
    setTimeout(() => {
        if (!emojis.value.some((e) => e.id === emoji.id)) return
        emoji.style.opacity = 0
        setTimeout(() => {
            emojis.value = emojis.value.filter((e) => e.id !== emoji.id)
        }, 1000)
    }, Math.random() * 5000 + 5000)
}

// Continuously generate emojis
const interval = ref<ReturnType<typeof setInterval> | undefined>(undefined)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
    if (!prefersReducedMotion) {
        interval.value = setInterval(generateEmoji, 1000)
    }
})

onUnmounted(() => {
    if (interval.value !== undefined) {
        clearInterval(interval.value)
    }
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
    height: 200vh; /* Extend the height to cover more of the background */
    overflow: hidden;
    z-index: 50;
    background-attachment: fixed; /* Fix the background position */
}

.emoji {
    animation: fall linear infinite;
    transition: transform 0.3s, opacity 0.3s, color 0.3s;
    pointer-events: auto; /* Enable pointer events for emojis */
}

@keyframes fall {
    to {
        transform: translateY(100vh) translateX(var(--random-translate-x)) rotate(calc(var(--initial-rotate) * var(--rotate-direction)));
    }
}

/* Disable animations if user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
    .emoji {
        animation: none;
    }
}
</style>
