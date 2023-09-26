<template>
    <div class="flex gap-2">
        <Button v-if="loading" :loading="true" :label="uploadLabel" type="button" severity="info" />
        <FileUpload v-else mode="basic" :disabled="loading" name="photo" :chooseLabel="uploadLabel" accept="image/*" :maxFileSize="maxFileSize" :invalidFileSizeMessage="invalidFileSizeMessage" auto customUpload @uploader="onUpload" />
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
const { setProfilePhotoUrl } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)

// Upload ref
const loading = ref(false)
const uploadLabel = 'Foto hochladen'
const maxFileSize = 5000000 // in bytes (5MB)
const maxFileSizeInMB = maxFileSize / 1000000
const invalidFileSizeMessage = `Maximale Dateigröße überschritten (erlaubt sind ${maxFileSizeInMB}MB), bitte wähle ein kleineres Foto aus.`

const onUpload = async(event: FileUploadUploaderEvent) => {
    // Get user id
    // If user is not logged in, show error toast and return
    const uid = user.value?.uid
    if (!uid) {
        toast.add({ severity: 'error', summary: 'Fehler', detail: 'Bitte loggen Sie sich ein', life: 3000 })
        return false
    }

    // Get file
    const file = (event.files as File[])[0]

    // Check if file exists
    if (!file) {
        toast.add({ severity: 'error', summary: 'Fehler', detail: 'Bitte wählen Sie ein Foto aus', life: 10000 })
        return false
    }

    // Upload file
    loading.value = true
    const downloadLink = await uploadFile(`users/${uid}/${file.name}`, file).catch((error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Foto konnte nicht hochgeladen werden',
            detail: error.message,
            life: 10000
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
                summary: 'Foto konnte nicht hochgeladen werden',
                detail: error.message,
                life: 10000
            })
            return false
        })

        // Show success toast
        if (response) {
            toast.add({ severity: 'success', summary: 'Erfolgreich', detail: 'Foto hochgeladen', life: 3000 })

            // Emit event to parent
            emit('uploaded')
        }
    }

    // Update user
    userStore.refreshUserProfile()

    loading.value = false
}
</script>
