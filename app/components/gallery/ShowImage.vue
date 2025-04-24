<script setup lang="ts">
import type { Image } from '@/types/Image'
import { useFileQuery } from '@/queries/useFileQuery'
import { useImage } from '@vueuse/core'
import { ref } from 'vue'

interface Props { image: Image | undefined, imagePath?: string, fullRes?: boolean, roundedClass?: string, mode?: 'single' }
const props = defineProps<Props>()
const { image, imagePath, fullRes, roundedClass, mode } = toRefs(props)

const { t } = useI18n()

const enableFullRes = ref(false)
const { data: mediumImageData } = useFileQuery(imagePath, ref('medium'), enableFullRes)
const mediumImageUrl = computed(() => mediumImageData.value?.previewUrl || '')
const mediumImageOptions = computed(() => ({ src: mediumImageUrl.value }))
const { isLoading: mediumImageLoading, isReady: isReadyMediumImage } = useImage(mediumImageOptions)

const { data: origImageData } = useFileQuery(imagePath, ref('original'), enableFullRes)
const origImageUrl = computed(() => origImageData.value?.previewUrl || '')
const origImageOptions = computed(() => ({ src: origImageUrl.value }))
const { isLoading: origImageLoading, isReady: isReadyOrigImage } = useImage(origImageOptions)

const srcToUse = computed(() => {
  if (!origImageLoading.value && isReadyOrigImage.value) {
    return origImageUrl.value
  }
  else if (!mediumImageLoading.value && isReadyMediumImage.value) {
    return mediumImageUrl.value
  }
  return image.value?.src
})

// Image loading and error handling
const loading = ref(true)
function onLoad() {
  loading.value = false
}
function onError() {
  loading.value = false
}

// Image hover effect
const hovered = ref(false)
function onEnter() {
  hovered.value = true
}
function onLeave() {
  hovered.value = false
}

function onShowImage() {
  // Enable full resolution image loading
  if (fullRes?.value) {
    enableFullRes.value = true
  }
}

function onHideImage() {
  // Disable full resolution image loading
  enableFullRes.value = false
}
</script>

<template>
  <Image
    :alt="image?.alt"
    :pt="{
      root: `${roundedClass || 'rounded-xl'} ${mode === 'single' ? '' : 'h-full'} grow w-full overflow-hidden shadow-lg hover:shadow-xl cursor-pointer group`,
      originalContainer: '',
    }"
    :title="image?.title"
    preview
    @show="onShowImage"
    @hide="onHideImage"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <template #previewicon>
      <div class="w-full h-full flex items-center justify-center">
        <span
          class="text-xl uppercase text-white px-4 py-2 rounded-lg"
          :class="[
            {
              'motion-opacity-in-[0%] motion-translate-y-in-[105%] motion-duration-[0.8s]': hovered,
              // 'motion-opacity-out-[100%] motion-translate-y-out-[0%] motion-duration-[0.8s]': !hovered
            },
          ]"
        >{{ t('gallery.showImage.preview') }}</span>
      </div>
    </template>
    <template #image>
      <!-- This is the preview image - thumbnail -->
      <div class="relative w-full h-full">
        <div v-if="loading" class="absolute inset-0 bg-gray-50 flex flex-col gap-4 items-center justify-center">
          <div class="w-full h-[400px] flex flex-col gap-4 items-center justify-center">
            <i class="pi pi-image animate-pulse text-gray-600 text-8xl" />
          </div>
        </div>
        <NuxtImg
          :src="image?.thumbnailSrc"
          :alt="image?.alt"
          :title="image?.title"
          loading="lazy"
          :placeholder="[300, 400, 75, 5]"
          quality="60"
          :class="{
            'hide-on-load': loading,
            'motion-scale-out-[1.4] motion-duration-[10s]': hovered,
            // 'motion-scale-out-[1] motion-duration-[10s]': !hovered
          }"
          class="w-full h-full object-cover"
          @load="onLoad"
          @error="onError"
        />
      </div>
    </template>
    <template #original="slotProps">
      <!-- This is the original image (fullscreen) -->
      <div class="relative w-full h-full">
        <!-- Loading spinner -->
        <div v-if="mediumImageLoading || origImageLoading" class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <!-- <i class="pi pi-spin pi-spinner text-gray-300 text-8xl" /> -->
          <ProgressSpinner />
        </div>
        <img
          :src="srcToUse"
          :alt="image?.alt"
          :title="image?.title"
          loading="lazy"
          :class="slotProps.class"
          :style="slotProps.style"
          @click="slotProps.previewCallback"
        >
      </div>
    </template>
  </Image>
</template>

<style scoped>
.hide-on-load {
    opacity: 0;
}
</style>
