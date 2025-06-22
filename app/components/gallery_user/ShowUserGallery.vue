<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import UploadMultipleImages from '@/components/gallery_user/UploadMultipleImages.vue'
import UploadSingleImage from '@/components/gallery_user/UploadSingleImage.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <template #content>
        <IconBackground icon="pi-instagram" />
        <div class="flex flex-col items-center gap-4">
          <ShowUnderline color="text-[#f2b69a]">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('gallery_user.header') }}
            </h2>
          </ShowUnderline>
          <div class="flex flex-col items-center gap-4">
            <p class="text-center text-md md:text-lg text-balance">
              {{ t('gallery_user.description') }}
            </p>
            <div class="flex items-center gap-4">
              <UploadSingleImage />
              <UploadMultipleImages />
            </div>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <IconBackground icon="pi-image" />
        <div class="flex flex-col items-center gap-8">
          <span>xxx</span>
        </div>
      </template>
    </Card>
  </div>
</template>
