<script setup lang="ts">
import type { Image } from '@/types/Image'
import ShowImage from '@/components/gallery/ShowImage.vue'
import { useFileQuery } from '@/queries/useFileQuery'
import { useElementVisibility, useImage } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'

interface Props { id: string, imagePath: string, roundedClass?: string }
const props = defineProps<Props>()
const emit = defineEmits(['isReady'])

const { id, imagePath, roundedClass } = toRefs(props)

const containerRef = useTemplateRef<HTMLDivElement>('container')
const containerIsVisible = useElementVisibility(containerRef)

const { data: thumbnailData, isLoading: isLoadingThumbnail, isFetching: isFetchingThumbnail } = useFileQuery(imagePath, ref('thumbnail'), containerIsVisible)
const loadingFile = computed(() => isLoadingThumbnail.value || isFetchingThumbnail.value)
const previewUrl = computed(() => thumbnailData.value?.previewUrl || '')
const fileName = computed(() => thumbnailData.value?.file?.name || 'No Name')
const fileLastModified = computed(() => thumbnailData.value?.file?.metadata?.lastModified || 'No Date')

const imageOptions = computed(() => ({ src: previewUrl.value }))
const { isLoading: imageLoading, error, isReady } = useImage(imageOptions)

const image = computed<Image>(() => ({
  src: previewUrl.value,
  thumbnailSrc: previewUrl.value,
  alt: fileName.value,
  title: fileName.value,
  lastModified: fileLastModified.value,
  size: thumbnailData.value?.file?.metadata?.size || 0,
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
      v-if="loadingFile || imageLoading"
      class="relative grow overflow-hidden shadow-lg hover:shadow-xl bg-gray-50 w-full h-[400px]"
      :class="[roundedClass || 'rounded-xl']"
    >
      <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center w-full h-[400px]">
        <i class="pi pi-image animate-pulse text-gray-300 text-8xl" />
      </div>
    </div>
    <template v-else-if="isReady">
      <ShowImage :image="image" :image-path="imagePath" full-res />
    </template>
  </div>
</template>

<style scoped>
.hide-on-load {
    opacity: 0;
}
</style>
