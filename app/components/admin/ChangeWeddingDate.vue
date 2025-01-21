<script setup lang="ts">
import type { PartialConfig } from '@/queries/config/model'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useConfig } from '@/composables/useConfig'
import { useAppStore } from '@/stores/app'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()

// Config
const { configData, isFetching, refetch } = useConfig()
const weddingDate = computed(() => configData.value?.weddingDate)
const appStore = useAppStore() // TODO: Refactor to useConfig Mutation

// Change wedding date
async function changeWeddingTimestamp(newTimestamp: Date) {
  // Convert timestamp to firestore timestamp
  const firestoreTimestamp = Timestamp.fromDate(newTimestamp)

  // Create config object
  const config: PartialConfig = {
    weddingDate: firestoreTimestamp,
  }

  // Update wedding date
  await appStore.updateConfig(config).catch((error) => {
    const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
    toast.add({
      severity: 'error',
      summary: t('admin.changeDate.error'),
      detail: errorMessage,
      life: 5000,
    })
    throw new Error(error.message)
  })

  // Show success message
  toast.add({
    severity: 'success',
    summary: t('admin.changeDate.success'),
    detail: t('admin.changeDate.successDetail'),
    life: 5000,
  })

  // Update app config
  refetch()
}
</script>

<template>
  <Card class="grow">
    <template #title>
      <h2>{{ t('admin.changeDate.header') }}</h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <ChangeTimestamp :timestamp="weddingDate?.seconds" :loading="isFetching" @change="changeWeddingTimestamp" />
        <div class="flex gap-4">
          <span class="text-2xl">{{ t('admin.changeDate.label') }}:</span>
          <DateDisplay :timestamp="weddingDate?.seconds" />
        </div>
        <ShowCountdown :timestamp="weddingDate?.seconds" />
      </div>
    </template>
  </Card>
</template>
