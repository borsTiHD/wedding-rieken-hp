<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import useFileServerApi from '@/composables/useFileServerApi'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['uploaded'])

// Composables
const toast = useToast()
const { t } = useI18n()
const { uploadFile } = useFileServerApi()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Max file size for picture
const maxFileSize = 10 * 1000 * 1000 // in bytes (10MB)
const maxFileSizeInMB = maxFileSize / 1000000

// Upload ref
const loading = ref(false)
const uploadLabel = t('admin.uploadGalleryFile.uploadLabel')
const invalidFileSizeMessage = t('admin.uploadGalleryFile.invalidFileSizeMessage', { maxFilesize: `${maxFileSizeInMB}MB` })

async function onUpload(event: FileUploadUploaderEvent) {
  // Check if user is logged in
  if (!user.value) {
    throw new Error(t('firebase.custom.noUserLoggedIn'))
  }

  // Check if user is admin
  if (userProfile.value && userProfile.value.role !== 'admin') {
    throw new Error(t('admin.notAdminError'))
  }

  // Get files
  const files = event.files as File[]

  // Check if files exist
  if (!files?.length) {
    toast.add({
      severity: 'error',
      summary: t('admin.uploadGalleryFile.noFileSelected'),
      detail: t('admin.uploadGalleryFile.noFileSelectedDetail'),
      life: 10000,
    })
    return false
  }

  // Upload files
  loading.value = true
  const uploadPromises = files.map((file) =>
    uploadFile(file, 'gallery').catch((error) => {
      console.error(`Error uploading file ${file.name}:`, error)
      return { success: false, error }
    })
  )

  const results = await Promise.allSettled(uploadPromises)

  // Handle results
  let successCount = 0
  let errorCount = 0

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value?.success) {
      successCount++
    } else {
      errorCount++
      const fileName = files[index]?.name || 'Unknown file'
      toast.add({
        severity: 'error',
        summary: t('admin.uploadGalleryFile.error'),
        detail: t('admin.uploadGalleryFile.errorDetail', { fileName }),
        life: 10000,
      })
    }
  })

  if (successCount > 0) {
    toast.add({
      severity: 'success',
      summary: t('admin.uploadGalleryFile.success'),
      detail: t('admin.uploadGalleryFile.successDetail', { count: successCount }),
      life: 3000,
    })

    // Emit event to parent
    emit('uploaded')
  }

  if (errorCount > 0) {
    console.error(`${errorCount} file(s) failed to upload.`)
  }

  loading.value = false
}
</script>

<template>
  <div class="flex flex-col">
    <Button v-if="loading" :loading="true" :label="uploadLabel" type="button" class="w-full" />
    <FileUpload v-else autofocus class="w-full" mode="basic" :disabled="loading" name="photo" :choose-label="uploadLabel" multiple accept="image/*" :max-file-size="maxFileSize" :invalid-file-size-message="invalidFileSizeMessage" auto custom-upload @uploader="onUpload" />
  </div>
</template>
