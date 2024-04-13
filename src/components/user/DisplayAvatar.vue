<template>
    <div :class="{ 'cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out': props.mode === 'button' }">
        <img
            v-if="photoURL"
            class="inline-block"
            :class="[
                { 'hover:shadow-lg transition-all duration-300 ease-in-out': props.mode === 'button' },
                { 'rounded-lg': !props.circle, 'rounded-full': props.circle },
                sizeClasses
            ]"
            :src="photoURL"
            alt="Your profile picture"
        >
        <span
            v-else
            class="inline-block overflow-hidden bg-gray-100"
            :class="[
                { 'hover:shadow-lg transition-all duration-300 ease-in-out': props.mode === 'button' },
                { 'rounded-lg': !props.circle, 'rounded-full': props.circle },
                sizeClasses
            ]"
            alt="No profile picture"
        >
            <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </span>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

type Props = {
    mode?: 'default' | 'button'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    circle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'default',
    size: 'md',
    circle: true
})

// User store
const userStore = useUserStore()
const photoURL = computed(() => userStore.photoURL)

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'h-8 w-8'
        case 'md':
            return 'h-14 w-14'
        case 'lg':
            return 'h-20 w-20'
        case 'xl':
            return 'h-24 w-24'
    }
})
</script>
