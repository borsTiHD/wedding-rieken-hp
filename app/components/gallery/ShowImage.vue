<script setup lang="ts">
import type { Image } from '@/types/Image'
import { ref } from 'vue'

interface Props { image: Image | undefined, roundedClass?: string }
const props = defineProps<Props>()
const { image, roundedClass } = toRefs(props)

const { t } = useI18n()

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
      root: `${roundedClass || 'rounded-xl'} grow w-full overflow-hidden shadow-lg hover:shadow-xl cursor-pointer group`,
      originalContainer: 'm-12 p-12',
    }"
    preview
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
      <div class="relative" :class="{ 'w-[300px] h-[400px]': loading }">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
          <ProgressSpinner class="size-12" />
        </div>
        <NuxtImg
          :src="image?.thumbnailSrc"
          :alt="image?.alt"
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
      <NuxtImg
        :src="image?.src"
        :alt="image?.alt"
        loading="lazy"
        :placeholder="[300, 400, 75, 5]"
        quality="80"
        class="w-full h-full max-h-screen object-cover"
        :style="slotProps.style"
        @click="slotProps.previewCallback"
      />
    </template>
  </Image>
</template>

<style scoped>
.hide-on-load {
    opacity: 0;
}
</style>
