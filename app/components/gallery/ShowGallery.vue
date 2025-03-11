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
        <div class="flex flex-col items-center">
          <div class="flex flex-col items-center">
            <div v-if="images && images.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ShowImage v-for="(picture, index) in images" :key="index" :image="picture" />
            </div>
            <p v-else>
              {{ t('gallery.noImages') }}
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
