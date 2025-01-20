<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Emit event
const emit = defineEmits(['loggedin'])

// Composables
const toast = useToast()
const { t } = useI18n()
const { reauthenticateUser } = useFirebaseAuth()

// Data
const loading = ref(false)

// Submit button
async function handleSubmit(form: { password: string }) {
  // Start loading
  loading.value = true

  // Reauthenticate user
  const response = await reauthenticateUser(form.password).catch((error: Error) => {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: t('user.reauthenticate.error'),
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
      summary: t('user.reauthenticate.success'),
      detail: t('user.reauthenticate.successDetail'),
      life: 3000,
    })

    // Emit event to parent
    emit('loggedin')
  }
}
</script>

<template>
  <FormKit
    v-slot="{ state: { valid } }"
    type="form"
    :actions="false"
    @submit="handleSubmit"
  >
    <div class="flex flex-col">
      <FormKit
        type="password"
        name="password"
        :label="t('user.reauthenticate.formkit.labelPassword')"
        :help="t('user.reauthenticate.formkit.labelPasswordHelp')"
        prefix-icon="password"
        validation="required"
      />

      <div class="flex gap-2">
        <Button :label="t('user.reauthenticate.submit')" icon="pi pi-check" type="submit" raised :loading="loading" :disabled="!valid" />
      </div>
    </div>
  </FormKit>
</template>
