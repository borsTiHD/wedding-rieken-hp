<script setup lang="ts">
import useUserFileServerApi from '@/composables/useUserFileServerApi'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()

const { uploadFile } = useUserFileServerApi()

const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    loading.value = true
    await uploadFile(file).then(() => {
      toast.add({
        severity: 'success',
        summary: t('gallery_user.success'),
        detail: t('gallery_user.successDetail'),
        life: 10000,
      })
    }).catch((error) => {
      console.error('File upload failed:', error)
      toast.add({
        severity: 'error',
        summary: t('gallery_user.error'),
        detail: t('gallery_user.errorUpload', { error: error.message }),
        life: 10000,
      })
    }).finally(() => {
      loading.value = false
    })
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
      :loading="loading"
      @click="triggerFileInput"
    />
  </div>
</template>
