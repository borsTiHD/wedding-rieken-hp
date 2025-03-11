<script setup lang="ts">
import type { Image } from '@/types/Image'
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import ShowImage from '@/components/gallery/ShowImage.vue'

interface Props { images: Image[] }
const props = defineProps<Props>()
const { images } = toRefs(props)

const { t } = useI18n()
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
        <div class="flex flex-col items-center gap-4">
          <div class="flex flex-col items-center">
            <div v-if="images && images.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ShowImage v-for="(picture, index) in images" :key="index" :image="picture" />
            </div>
            <p v-else>
              {{ t('gallery.noImages') }}
            </p>
          </div>
        </div>

        <hr class="my-8 border-t border-gray-300 w-full">

        <!-- <div class="flex flex-col items-center gap-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(image, index) in images" :key="index" class="p-4">
              <ShowImage :image="image" />
            </div>
          </div>
        </div>

        <hr class="my-8 border-t border-gray-300 w-full"> -->

        <div class="flex flex-col items-center gap-4">
          <div class="flex flex-wrap">
            <div class="flex w-1/2 flex-wrap">
              <div v-for="(image, index) in images.slice(0, 3)" :key="index" class="flex p-4" :class="index === 2 ? 'w-full' : 'w-1/2'">
                <ShowImage :key="index" :image="image" />
              </div>
            </div>
            <div class="flex w-1/2 flex-wrap">
              <div v-for="(image, index) in images.slice(3, 6)" :key="index" class="flex p-4" :class="index === 0 ? 'w-full' : 'w-1/2'">
                <ShowImage :key="index" :image="image" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <IconBackground icon="pi-image" />
        <div class="flex flex-col items-center gap-4">
          <div class="flex flex-col items-center">
            <p class="text-center text-md md:text-lg text-balance">
              {{ t('gallery.footerText') }}
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
