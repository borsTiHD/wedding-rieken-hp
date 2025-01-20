<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

// Refs
const loading = ref(false)

// Composables
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()
const { sendUserPasswordResetEmail } = useFirebaseAuth()
const { emailLinkOnly } = useFirebaseSignInMethods()

// Confirm dialog
function confirmDialog(event: MouseEvent) {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t('user.password.resetPassword.confirmMessage'),
    acceptLabel: t('buttons.yes'),
    rejectLabel: t('buttons.no'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      handleSubmit() // Submit Button
    },
  })
}

// Submit button
async function handleSubmit() {
  // Start loading
  loading.value = true

  // Update users email
  const response = await sendUserPasswordResetEmail().catch((error: Error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('user.password.resetPassword.error'),
      detail: error.message,
      life: 10000,
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
      life: 3000,
    })
  }
}
</script>

<template>
  <ConfirmPopup />
  <Button
    :label="emailLinkOnly ? t('user.password.resetPassword.emailSignInOnly') : t('user.password.resetPassword.submitButton')"
    class="whitespace-nowrap w-full"
    icon="pi pi-lock-open"
    raised
    :loading="loading"
    @click="confirmDialog($event)"
  />
</template>
