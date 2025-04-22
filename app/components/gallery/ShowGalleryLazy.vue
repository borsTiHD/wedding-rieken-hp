<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import ShowImageLazy from '@/components/gallery/ShowImageLazy.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

interface Props { imagePaths: string[], loading: boolean }
const props = defineProps<Props>()
const emit = defineEmits(['isReady'])
const { imagePaths, loading } = toRefs(props)
const { t } = useI18n()

// Window size for mobile check
const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger

// Map to track the ready state of image paths
const imageReadyState = ref(new Map<string, boolean>())

function checkIndexSmallDevice(index: number): boolean {
  return Math.floor(index / 2) % 2 === 1
}

function checkIndexBigDevice(index: number): boolean {
  const cycleLength = 6 // 2 false -> 2 true -> 4 false -> 2 true -> 4 false...
  const positionInCycle = index % cycleLength
  return positionInCycle >= 2 && positionInCycle < 4
}

function checkIndex(index: number): boolean {
  if (smAndLarger.value) {
    return checkIndexBigDevice(index)
  }
  else {
    return checkIndexSmallDevice(index)
  }
}

function imageClasses(index: number) {
  return [
    { 'col-span-2 row-span-2': checkIndex(index) },
    { 'col-span-1 row-span-1': !checkIndex(index) },
  ]
}

function handleIsReady(id: string) {
  const index = Number.parseInt(id.split('-')[0] || '0')
  const imagePath = imagePaths.value?.[index]
  if (typeof imagePath === 'string') {
    // Update the ready state of the image
    imageReadyState.value.set(imagePath, true)
  }
}

// Computed property to check if all images are ready
const allImagesReady = computed(() => {
  return imagePaths.value?.every(path => imageReadyState.value.get(path) === true)
})

watch(allImagesReady, (ready) => {
  if (ready && imagePaths.value?.length > 0) {
    emit('isReady', 'all-images-ready')
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <template #content>
        <IconBackground icon="pi-image" />
        <div class="flex flex-col items-center gap-4">
          <ShowUnderline color="text-[#f2b69a]">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('gallery.header') }}
            </h2>
          </ShowUnderline>
          <div class="flex flex-col items-center gap-4">
            <p class="text-center text-md md:text-lg text-balance">
              {{ t('gallery.description') }}
            </p>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <IconBackground icon="pi-image" />
        <div class="flex flex-col items-center gap-8">
          <div v-if="imagePaths && imagePaths?.length > 0" class="grid md:grid-cols-4 gap-4">
            <div
              v-for="(path, index) in imagePaths"
              :key="`${index}-${path}`"
              class="flex"
              :class="imageClasses(index)"
            >
              <ShowImageLazy :id="`${index}-${path}`" :image-path="path" @is-ready="handleIsReady" />
            </div>
          </div>
          <div v-if="loading" class="flex gap-2 items-center justify-center">
            <i class="pi pi-spin pi-spinner text-4xl text-gray-500" />
            <span class="text-gray-500 text-lg animate-pulse">
              {{ imagePaths?.length > 0 ? t('gallery.loadingMore') : t('gallery.loading') }}
            </span>
          </div>
          <p v-else-if="imagePaths?.length === 0" class="text-center text-md md:text-lg text-balance">
            {{ t('gallery.noImages') }}
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>
