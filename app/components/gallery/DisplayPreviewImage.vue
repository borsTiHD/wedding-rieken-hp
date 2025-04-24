<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import { useFileQuery } from '@/queries/useFileQuery'
import { useImage } from '@vueuse/core'

interface Props {
  path: string
  mode?: 'default' | 'button'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  alt?: string | null
  circle?: boolean
  shadow?: boolean
  cover?: boolean
  preview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'default',
  size: 'md',
  alt: null,
  circle: false,
  shadow: false,
  cover: true,
  preview: false,
})

const filePath = computed(() => props.path)
const { data: fileData, isLoading, isFetching } = useFileQuery(filePath, ref('thumbnail'))
const loading = computed(() => isLoading.value || isFetching.value)
const previewUrl = computed(() => fileData.value?.previewUrl || '')

const imageOptions = computed(() => ({ src: previewUrl.value }))
const { isLoading: imageLoading, error, isReady } = useImage(imageOptions)

watch(error, (err: any) => {
  if (err && imageOptions.value?.src) {
    console.error('Image loading error:', err)
  }
})
</script>

<template>
  <div v-if="loading || imageLoading" class="h-14 w-14 shadow-md rounded-md bg-gray-200 flex items-center justify-center">
    <i class="pi pi-spin pi-spinner text-gray-500 text-2xl" />
  </div>
  <DisplayAvatar v-else-if="isReady" :src="previewUrl" alt="Preview" shadow cover preview />
  <div v-else class="h-14 w-14 shadow-md rounded-md bg-gray-200 flex items-center justify-center">
    <span class="text-gray-500 text-center select-none">No File</span>
  </div>
</template>
