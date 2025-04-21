<script setup lang="ts">
import type { Image } from '@/types/Image'
import ShowImage from '@/components/gallery/ShowImage.vue'
import { useFileQuery } from '@/queries/useFileQuery'
import { useElementVisibility, useImage } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

interface Props { imagePath: string, roundedClass?: string }
const props = defineProps<Props>()
const { imagePath, roundedClass } = toRefs(props)

const containerRef = useTemplateRef<HTMLDivElement>('container')
const containerIsVisible = useElementVisibility(containerRef)

const { data: fileData, isLoading, isFetching } = useFileQuery(imagePath, ref(true), containerIsVisible)
const loadingFile = computed(() => isLoading.value || isFetching.value)
const previewUrl = computed(() => fileData.value?.previewUrl || '')
const fileName = computed(() => fileData.value?.file?.name || 'No Name')
const fileLastModified = computed(() => fileData.value?.file?.metadata?.lastModified || 'No Date')

const imageOptions = computed(() => ({ src: previewUrl.value }))
const { isLoading: imageLoading, error, isReady } = useImage(imageOptions)

const image = computed<Image>(() => ({
  src: previewUrl.value,
  thumbnailSrc: previewUrl.value,
  alt: fileName.value,
  title: fileName.value,
  lastModified: fileLastModified.value,
  size: fileData.value?.file?.metadata?.size || 0,
}))

watch(error, (err: any) => {
  if (err && imageOptions.value?.src) {
    console.error('Image loading error:', err)
  }
})
</script>

<template>
  <div ref="container" class="w-full h-full grow">
    <div
      v-if="loadingFile || imageLoading"
      class="relative grow overflow-hidden shadow-lg hover:shadow-xl bg-gray-50 w-[300px] h-[400px]"
      :class="[roundedClass || 'rounded-xl']"
    >
      <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center w-[300px] h-[400px]">
        <i class="pi pi-image text-gray-300 text-8xl" />
        <ProgressSpinner class="size-12" />
      </div>
    </div>
    <template v-else-if="isReady">
      <ShowImage :image="image" />
    </template>
  </div>
</template>

<style scoped>
.hide-on-load {
    opacity: 0;
}
</style>
