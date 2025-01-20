<script setup lang="ts">
import UploadLocationPicture from '@/components/admin/UploadLocationPicture.vue'
import { useConfig } from '@/composables/useConfig'

const { t } = useI18n()
const { locationPreviewUrl, refetch } = useConfig()
</script>

<template>
  <Card class="grow">
    <template #title>
      <h2>{{ t('admin.changeLocation.previewHeader') }}</h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="col-span-full flex items-center gap-x-8 pb-4">
          <Image v-if="locationPreviewUrl" :src="locationPreviewUrl" alt="Location Preview" width="250" image-class="rounded-lg" preview />
          <Skeleton v-else size="12rem" />
          <UploadLocationPicture @uploaded="refetch()" />
        </div>
      </div>
    </template>
  </Card>
</template>
