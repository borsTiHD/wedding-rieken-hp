<script setup lang="ts">
import useUserFileServerApi from '@/composables/useUserFileServerApi'

const { t } = useI18n()

const { uploadFile } = useUserFileServerApi()

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      style="display: none"
      @change="onFileChange"
    >
    <Button
      icon="pi pi-camera"
      :label="t('gallery_user.uploadPhoto')"
      @click="triggerFileInput"
    />
  </div>
</template>
