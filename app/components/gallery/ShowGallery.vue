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
        <div class="container mx-auto">
          <div v-if="images" class="flex flex-wrap -mx-4">
            <div v-for="(picture, index) in images" :key="index" class="w-full md:w-1/3 p-4">
              <ShowImage :image="picture" />
            </div>
          </div>

          <p v-else>
            {{ t('gallery.noImages') }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
