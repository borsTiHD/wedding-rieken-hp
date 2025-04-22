<script setup lang="ts">
import type { Image } from '@/types/Image'
import { ref } from 'vue'

interface Props { image: Image | undefined, roundedClass?: string, mode?: 'single' }
const props = defineProps<Props>()
const { image, roundedClass, mode } = toRefs(props)

const { t } = useI18n()

const showTools = ref(false)

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
    @show="showTools = true"
    @hide="showTools = false"
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
      <img
        :src="image?.src"
        :alt="image?.alt"
        :title="image?.title"
        loading="lazy"
        :class="slotProps.class"
        :style="slotProps.style"
        @click="slotProps.previewCallback"
      >
      <!-- <NuxtImg
        :src="image?.src"
        :alt="image?.alt"
        :title="image?.title"
        loading="lazy"
        :placeholder="[300, 400, 75, 5]"
        quality="80"
        :class="slotProps.class"
        :style="slotProps.style"
        @click="slotProps.previewCallback"
      /> -->
    </template>
  </Image>
</template>

<style scoped>
.hide-on-load {
    opacity: 0;
}
</style>
