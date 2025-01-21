<script setup lang="ts">
import type { PartialConfig } from '@/queries/config/model'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useConfig } from '@/composables/useConfig'
import { useAppStore } from '@/stores/app'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()

// Config
const { configData, isFetching, refetch } = useConfig()
const appStore = useAppStore() // TODO: Refactor to useConfig Mutation

// Change wedding date
async function changeDeadlineTimestamp(newTimestamp: Date) {
  // Convert timestamp to firestore timestamp
  const firestoreTimestamp = Timestamp.fromDate(newTimestamp)

  const config: PartialConfig = {
    deadline: firestoreTimestamp,
  }

  // Update wedding date
  await appStore.updateConfig(config).catch((error) => {
    const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
    toast.add({
      severity: 'error',
      summary: t('admin.changeDeadline.error'),
      detail: errorMessage,
      life: 5000,
    })
    throw new Error(error.message)
  })

  // Show success message
  toast.add({
    severity: 'success',
    summary: t('admin.changeDeadline.success'),
    detail: t('admin.changeDeadline.successDetail'),
    life: 5000,
  })

  // Update app config
  refetch()
}
</script>

<template>
  <Card class="grow">
    <template #title>
      <h2>{{ t('admin.changeDeadline.header') }}</h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <Message severity="warn" class="w-full">
          {{ t('admin.changeDeadline.infoText') }}
        </Message>
        <ChangeTimestamp :timestamp="configData?.deadline.seconds" :loading="isFetching" @change="changeDeadlineTimestamp" />
        <div class="flex gap-4">
          <span class="text-2xl">{{ t('admin.changeDeadline.label') }}:</span>
          <DateDisplay :timestamp="configData?.deadline.seconds" />
        </div>
      </div>
    </template>
  </Card>
</template>
