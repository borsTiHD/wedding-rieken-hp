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
  // This is not necessary, because the button is only visible for admins also the API will throw an error if the user is not admin
  if (userProfile.value && userProfile.value.role !== 'admin') {
    throw new Error(t('admin.notAdminError'))
  }

  // Get file
  const file = (event.files as File[])[0]

  // Check if file exists
  if (!file) {
    toast.add({
      severity: 'error',
      summary: t('admin.uploadGalleryFile.noFileSelected'),
      detail: t('admin.uploadGalleryFile.noFileSelectedDetail'),
      life: 10000,
    })
    return false
  }

  // Upload file
  loading.value = true
  const response = await uploadFile(file, 'gallery').catch((error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('admin.uploadGalleryFile.error'),
      detail: error.message,
      life: 10000,
    })
    return undefined
  })

  // If download link exists and is a string update the location preview filename in the app config
  if (response && response?.success) {
    toast.add({
      severity: 'success',
      summary: t('admin.uploadGalleryFile.success'),
      detail: t('admin.uploadGalleryFile.successDetail'),
      life: 3000,
    })

    // Emit event to parent
    emit('uploaded')
  }
  else {
    console.error('File upload failed:', response)
    toast.add({
      severity: 'error',
      summary: t('admin.uploadGalleryFile.error'),
      detail: t('admin.uploadGalleryFile.errorDetail'),
      life: 10000,
    })
  }

  loading.value = false
}
</script>

<template>
  <div class="flex flex-col">
    <Button v-if="loading" :loading="true" :label="uploadLabel" type="button" class="w-full" />
    <FileUpload v-else autofocus class="w-full" mode="basic" :disabled="loading" name="photo" :choose-label="uploadLabel" accept="image/*" :max-file-size="maxFileSize" :invalid-file-size-message="invalidFileSizeMessage" auto custom-upload @uploader="onUpload" />
  </div>
</template>
