<template>
    <div class="flex gap-2 w-full">
        <Button class="grow" :label="t('user.invitation.labelAccept')" icon="pi pi-thumbs-up" type="submit" :loading="loading" @click="handleSubmit(true)" />
        <Button class="grow" :label="t('user.invitation.labelDecline')" icon="pi pi-thumbs-down" type="submit" severity="danger" outlined :loading="loading" @click="handleSubmit(false)" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import type { PartialUserProfile } from '@/types/UserProfile'

// Emit event
const emit = defineEmits(['changed'])

// Composables
const toast = useToast()
const { t } = useI18n()
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(value: boolean) => {
    // Start loading
    loading.value = true

    // Set invitation response
    const userResponse = value ? 'accepted' : 'declined'

    // Update users profile
    const data: PartialUserProfile = { invitation: userResponse }
    const response = await changeAdditionalUserProfileData(data).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.invitation.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Update user
    userStore.refreshUserProfile()

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('user.invitation.success'),
            detail: t('user.invitation.successDetail'),
            life: 10000
        })

        // Emit event to parent
        emit('changed')
    }
}
</script>
