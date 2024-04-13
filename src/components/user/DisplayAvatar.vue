<template>
    <div :class="{ 'cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out': props.mode === 'button' }">
        <img v-if="photoURL" class="inline-block h-14 w-14 rounded-full" :class="{ 'hover:shadow-lg transition-all duration-300 ease-in-out': props.mode === 'button' }" :src="photoURL" alt="Your profile picture">
        <span v-else class="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100" :class="{ 'hover:shadow-lg transition-all duration-300 ease-in-out': props.mode === 'button' }" alt="No profile picture">
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
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'default'
})

// User store
const userStore = useUserStore()
const photoURL = computed(() => userStore.photoURL)
</script>
