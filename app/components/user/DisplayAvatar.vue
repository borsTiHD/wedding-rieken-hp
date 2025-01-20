<script setup lang="ts">
import { useUserStore } from '@/stores/user'

interface Props {
  mode?: 'default' | 'button'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  src?: string | null
  alt?: string | null
  circle?: boolean
  shadow?: boolean
  cover?: boolean
  preview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'default',
  size: 'md',
  src: null,
  alt: null,
  circle: false,
  shadow: false,
  cover: true,
  preview: false,
})

// User store
const userStore = useUserStore()
const photoURL = computed(() => props.src ? props.src : userStore.photoURL)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-8 w-8'
    case 'sm':
      return 'h-12 w-12'
    case 'md':
      return 'h-14 w-14'
    case 'lg':
      return 'h-20 w-20'
    case 'xl':
      return 'h-24 w-24'
    case '2xl':
      return 'h-48 w-48'
    case '3xl':
      return 'h-64 w-64'
  }
})
</script>

<template>
  <div :class="{ 'cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out': props.mode === 'button' }">
    <Image
      v-if="photoURL"
      :image-class="[
        'inline-block',
        { 'hover:shadow-lg transition-all duration-300 ease-in-out': props.mode === 'button' },
        { 'shadow-md': props.shadow },
        { 'object-cover': props.cover },
        { 'rounded-lg': !props.circle, 'rounded-full': props.circle },
        sizeClasses,
      ]"
      :src="photoURL"
      :alt="props.alt ? props.alt : 'Profile picture'"
      :preview="props.preview"
    />
    <span
      v-else
      class="inline-block overflow-hidden bg-gray-100"
      :class="[
        { 'hover:shadow-lg transition-all duration-300 ease-in-out': props.mode === 'button' },
        { 'shadow-lg': props.shadow },
        { 'rounded-lg': !props.circle, 'rounded-full': props.circle },
        sizeClasses,
      ]"
      :alt="props.alt ? props.alt : 'No profile picture'"
    >
      <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  </div>
</template>
