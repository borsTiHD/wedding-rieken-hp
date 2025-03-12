<script setup lang="ts">
import type { Image } from '@/types/Image'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import ShowImage from '@/components/gallery/ShowImage.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

interface Props { images: Image[] }
const props = defineProps<Props>()
const { images } = toRefs(props)

const { t } = useI18n()

// Window size for mobile check
const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger

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
</script>

<template>
  <div class="flex flex-col gap-4 mx-auto sm:w-11/12 lg:w-10/12 xl:w-8/12">
    <Card>
      <template #content>
        <IconBackground icon="pi-image" />
        <div class="flex flex-col items-center gap-4">
          <!-- <ShowUnderline color="text-blue-400"> -->
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
        <!-- <div class="flex flex-col items-center gap-4">
          <div class="flex flex-col items-center">
            <div v-if="images && images.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ShowImage v-for="(picture, index) in images" :key="index" :image="picture" />
            </div>
            <p v-else>
              {{ t('gallery.noImages') }}
            </p>
          </div>
        </div> -->

        <div class="flex flex-col items-center">
          <div v-if="images && images.length" class="grid md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="flex"
              :class="imageClasses(index)"
            >
              <ShowImage :image="image" />
            </div>
          </div>
          <p v-else>
            {{ t('gallery.noImages') }}
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>
