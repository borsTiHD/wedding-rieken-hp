<template>
    <ConfirmPopup />
    <Button class="whitespace-nowrap p-0 sm:p-2" :label="t('user.password.resetPassword.forgotButton')" text size="small" :loading="loading" @click="confirmDialog($event)" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

// Refs
const loading = ref(false)

// Composables
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()
const { sendUserPasswordResetEmail } = useFirebaseAuth()

const props = defineProps<{
    email: string
}>()

// Confirm dialog
const confirmDialog = (event: MouseEvent) => {
    // Check if email is set
    if (!props.email || props.email === '') {
        toast.add({
            severity: 'error',
            summary: t('user.password.resetPassword.error'),
            detail: t('user.password.resetPassword.noMail'),
            life: 10000
        })
        return false
    }

    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: t('user.password.resetPassword.confirmMessage'),
        acceptLabel: t('buttons.yes'),
        rejectLabel: t('buttons.no'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            handleSubmit() // Submit Button
        }
    })
}

// Submit button
const handleSubmit = async() => {
    // Start loading
    loading.value = true

    // Send password reset email
    const response = await sendUserPasswordResetEmail(props.email).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.password.resetPassword.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('user.password.resetPassword.success'),
            detail: t('user.password.resetPassword.successDetail'),
            life: 3000
        })
    }
}
</script>
