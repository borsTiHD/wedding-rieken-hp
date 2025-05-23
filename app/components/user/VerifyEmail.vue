<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

interface Props {
  mode?: 'small' | 'large'
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'large',
})

// Composables
const { t } = useI18n()
const toast = useToast()
const { sendUserEmailVerification } = useFirebaseAuth()

// Email verification
const loadingEmailVerify = ref(false)
async function handleVerifyEmail() {
  // Start loading
  loadingEmailVerify.value = true

  // Send email verification
  const response = await sendUserEmailVerification().catch((error: Error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('user.email.verifiedError'),
      detail: error.message,
      life: 10000,
    })
    return false
  })

  // Show success toast
  if (response) {
    toast.add({
      severity: 'success',
      summary: t('user.email.verifiedSuccess'),
      detail: t('user.email.verifiedSuccessDetail'),
      life: 10000,
    })
  }

  // Stop loading
  loadingEmailVerify.value = false
}
</script>

<template>
  <!-- Mode: small -->
  <Button
    v-if="props.mode === 'small'"
    v-tooltip.bottom="t('user.email.tooltipPlzVerifie')"
    :aria-label="t('user.email.verifieAriaLabel')"
    icon="pi pi-exclamation-circle"
    outlined
    class="p-0"
    severity="info"
    :loading="loadingEmailVerify"
    @click.stop.prevent="handleVerifyEmail"
  />

  <!-- Mode: large (default) -->
  <Button
    v-else-if="props.mode === 'large' || !props.mode"
    v-tooltip.bottom="t('user.email.tooltipPlzVerifie')"
    :label="t('user.email.verifieAriaLabel')"
    :aria-label="t('user.email.verifieAriaLabel')"
    icon="pi pi-exclamation-circle"
    class="whitespace-nowrap w-full"
    severity="info"
    raised
    :loading="loadingEmailVerify"
    @click.stop.prevent="handleVerifyEmail"
  />
</template>
