<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import { useFirebaseStorage } from '@/composables/useFirebaseStorage'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['uploaded'])

// Composables
const toast = useToast()
const { uploadFile } = useFirebaseStorage()
const { setProfilePhotoUrl } = useFirebaseUserProfile()
const { maxFileSize, maxFileSizeInMB } = useProfileChecker()

// User store
const userStore = useUserStore()
const { t } = useI18n()
const user = computed(() => userStore.user)

// Upload ref
const loading = ref(false)
const uploadLabel = t('user.profilePicture.submitButton')
const invalidFileSizeMessage = t('user.profilePicture.invalidFileSizeMessage', { maxFilesize: `${maxFileSizeInMB}MB` })

async function onUpload(event: FileUploadUploaderEvent) {
  // Get user id
  // If user is not logged in, show error toast and return
  const uid = user.value?.uid
  if (!uid) {
    toast.add({
      severity: 'error',
      summary: t('user.profilePicture.notLoggedInError'),
      detail: t('user.profilePicture.notLoggedInDetail'),
      life: 10000,
    })
    return false
  }

  // Get file
  const file = (event.files as File[])[0]

  // Check if file exists
  if (!file) {
    toast.add({
      severity: 'error',
      summary: t('user.profilePicture.noPictureSelected'),
      detail: t('user.profilePicture.noPictureSelectedDetail'),
      life: 10000,
    })
    return false
  }

  // Upload file
  loading.value = true
  const downloadLink = await uploadFile(`users/${uid}/${file.name}`, file).catch((error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('user.profilePicture.error'),
      detail: error.message,
      life: 10000,
    })
    return false
  })

  // If response is false, return
  if (downloadLink && typeof downloadLink === 'string') {
    // Update user profile
    const response = await setProfilePhotoUrl(downloadLink).catch((error: Error) => {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('user.profilePicture.error'),
        detail: error.message,
        life: 10000,
      })
      return false
    })

    // Show success toast
    if (response) {
      toast.add({
        severity: 'success',
        summary: t('user.profilePicture.success'),
        detail: t('user.profilePicture.successDetail'),
        life: 3000,
      })

      // Emit event to parent
      emit('uploaded')
    }
  }

  // Update user
  userStore.refreshUserProfile()

  loading.value = false
}
</script>

<template>
  <div class="flex flex-col">
    <Button v-if="loading" :loading="true" :label="uploadLabel" type="button" class="w-full" />
    <FileUpload v-else autofocus class="w-full" mode="basic" :disabled="loading" name="photo" :choose-label="uploadLabel" accept="image/*" :max-file-size="maxFileSize" :invalid-file-size-message="invalidFileSizeMessage" auto custom-upload @uploader="onUpload" />
    <p class="mt-2 text-xs leading-5 text-gray-400">
      {{ t('user.profilePicture.uploadDescription', { maxFilesize: `${maxFileSizeInMB}MB` }) }}
    </p>
  </div>
</template>
