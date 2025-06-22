<script setup lang="ts">
import type { Image } from '@/types/Image'
import ShowImage from '@/components/gallery_user/ShowImage.vue'
import { useElementVisibility, useImage } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'

interface Props { id: string, imagePath: string, roundedClass?: string }
const props = defineProps<Props>()
const emit = defineEmits(['isReady'])

const { id, imagePath, roundedClass } = toRefs(props)

const containerRef = useTemplateRef<HTMLDivElement>('container')
const containerIsVisible = useElementVisibility(containerRef)

const completeSrc = ref('')
const imageOptions = computed(() => ({ src: completeSrc.value }))
const { isLoading: imageLoading, error, isReady } = useImage(imageOptions)

const basePath = 'api/user/files'
const completeImagePath = `${basePath}/${imagePath.value}`
const thumbnailPath = `${completeImagePath}?mode=thumbnail`

watch(containerIsVisible, (visible) => {
  if (visible) {
    completeSrc.value = thumbnailPath
  }
})

const image = computed<Image>(() => ({
  src: completeSrc.value,
  thumbnailSrc: completeSrc.value,
  alt: id.value,
  title: id.value,
  lastModified: 0,
  size: 0,
}))

watch(error, (err: any) => {
  if (err && imageOptions.value?.src) {
    console.error('Image loading error:', err)
  }
})

// Watch for isReady and emit the event when it becomes true
watch(isReady, (ready) => {
  if (ready) {
    emit('isReady', id.value)
  }
})
</script>

<template>
  <div ref="container" class="w-full h-full grow">
    <div
      v-if="imageLoading"
      class="relative grow overflow-hidden shadow-lg hover:shadow-xl bg-gray-50 min-w-48 w-full h-[400px]"
      :class="[roundedClass || 'rounded-xl']"
    >
      <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center w-full h-[400px]">
        <i class="pi pi-image animate-pulse text-gray-300 text-8xl" />
      </div>
    </div>
    <template v-else-if="isReady">
      <!-- <ShowImage :image="image" :image-path="completeImagePath" full-res /> -->
      <ShowImage :image="image" :image-path="completeImagePath" />
    </template>
  </div>
</template>

<style scoped>
.hide-on-load {
    opacity: 0;
}
</style>
