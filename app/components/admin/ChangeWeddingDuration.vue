<script setup lang="ts">
import type { PartialConfig } from '@/queries/config/model'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useConfig } from '@/composables/useConfig'
import { useAppStore } from '@/stores/app'
import { submitForm } from '@formkit/core'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()

// Config
const { weddingDuration, refetch } = useConfig()
const appStore = useAppStore() // TODO: Refactor to useConfig Mutation

// Data
const loading = ref(false)
const defaultDuration = ref(weddingDuration.value)
const formId = 'changeDurationForm'

// Submit button
async function handleSubmit(form: { duration: number }) {
  loading.value = true
  await changeWeddingDuraiton(form).catch(() => { return false })
  loading.value = false
}

// Change wedding duration
async function changeWeddingDuraiton(form: { duration: number }) {
  // Create config object
  const config: PartialConfig = {
    weddingDuration: form.duration,
  }

  // Update wedding duration
  await appStore.updateConfig(config).catch((error) => {
    const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
    toast.add({
      severity: 'error',
      summary: t('admin.changeDuration.error'),
      detail: errorMessage,
      life: 5000,
    })
    throw new Error(error.message)
  })

  // Show success message
  toast.add({
    severity: 'success',
    summary: t('admin.changeDuration.success'),
    detail: t('admin.changeDuration.successDetail'),
    life: 5000,
  })

  // Update app config
  await refetch()
}
</script>

<template>
  <Card class="grow">
    <template #title>
      <h2>{{ t('admin.changeDuration.header') }}</h2>
    </template>
    <template #content>
      <FormKit
        :id="formId"
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
      >
        <div class="flex flex-col items-center gap-4">
          <Message severity="info" class="w-full">
            {{ t('admin.changeDuration.infoText') }}
          </Message>
          <FormKit
            v-model="defaultDuration"
            type="number"
            name="duration"
            outer-class="w-full"
            :label="t('admin.changeDuration.label')"
            validation="required|min:0|max:48"
            number
          />
          <Button :label="t('admin.changeDuration.submit')" class="w-full" icon="pi pi-clock" raised :loading="loading" :disabled="!valid" @click="submitForm(formId)" />
        </div>
      </FormKit>
    </template>
  </Card>
</template>
