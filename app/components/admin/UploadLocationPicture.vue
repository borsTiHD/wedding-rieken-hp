<template>
    <div class="flex flex-col">
        <Button v-if="loading" :loading="true" :label="uploadLabel" type="button" class="w-full" />
        <FileUpload v-else autofocus class="w-full" mode="basic" :disabled="loading" name="photo" :chooseLabel="uploadLabel" accept="image/*" :maxFileSize="maxFileSize" :invalidFileSizeMessage="invalidFileSizeMessage" auto customUpload @uploader="onUpload" />
        <p class="mt-2 text-xs leading-5 text-gray-400">{{ t('user.profilePicture.uploadDescription', { maxFilesize: `${maxFileSizeInMB}MB` }) }}</p>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useFirebaseStorage } from '@/composables/useFirebaseStorage'
import { useUserStore } from '@/stores/user'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'

const emit = defineEmits(['uploaded'])

// Composables
const toast = useToast()
const { uploadFile } = useFirebaseStorage()
const { update } = useFirestore()
const { t } = useI18n()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Max file size for picture
const maxFileSize = 10 * 1000 * 1000 // in bytes (10MB)
const maxFileSizeInMB = maxFileSize / 1000000

// Upload ref
const loading = ref(false)
const uploadLabel = t('admin.changeLocation.uploadLabel')
const invalidFileSizeMessage = t('admin.changeLocation.invalidFileSizeMessage', { maxFilesize: `${maxFileSizeInMB}MB` })

const onUpload = async(event: FileUploadUploaderEvent) => {
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
            summary: t('admin.changeLocation.noPictureSelected'),
            detail: t('admin.changeLocation.noPictureSelectedDetail'),
            life: 10000
        })
        return false
    }

    // Upload file
    loading.value = true
    const fileName = `location-preview-${file.name}`
    const downloadLink = await uploadFile(`app/${fileName}`, file).catch((error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('admin.changeLocation.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // If download link exists and is a string update the location preview filename in the app config
    if (downloadLink && typeof downloadLink === 'string') {
        // Update preview url
        await update('app', 'config', 'locationPreview', fileName).catch((error: { message: string }) => {
            toast.add({
                severity: 'error',
                summary: t('admin.changeLocation.error'),
                detail: error.message,
                life: 10000
            })
            loading.value = false
            throw new Error(error.message)
        })

        // Show success toast
        toast.add({
            severity: 'success',
            summary: t('admin.changeLocation.success'),
            detail: t('admin.changeLocation.successDetail'),
            life: 3000
        })

        // Emit event to parent
        emit('uploaded')
    }

    loading.value = false
}
</script>
