<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.changeDate.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <ChangeTimestamp :timestamp="config?.weddingDate.seconds" @change="changeWeddingTimestamp" />
                <div class="flex gap-4">
                    <span class="text-2xl">{{ t('admin.changeDate.label') }}:</span>
                    <DateDisplay :timestamp="config?.weddingDate.seconds" />
                </div>
                <ShowCountdown :timestamp="config?.weddingDate.seconds" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { Timestamp } from '@firebase/firestore'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useAppStore } from '@/stores/app'
import type { PartialConfig } from '@/queries/config/model'

// Composables
const { t } = useI18n() // Localisation
const toast = useToast()

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)

// Change wedding date
const changeWeddingTimestamp = async(newTimestamp: Date) => {
    // Convert timestamp to firestore timestamp
    const firestoreTimestamp = Timestamp.fromDate(newTimestamp)

    // Create config object
    const config: PartialConfig = {
        weddingDate: firestoreTimestamp
    }

    // Update wedding date
    await appStore.updateConfig(config).catch((error) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
        toast.add({
            severity: 'error',
            summary: t('admin.changeDate.error'),
            detail: errorMessage,
            life: 5000
        })
        throw new Error(error.message)
    })

    // Show success message
    toast.add({
        severity: 'success',
        summary: t('admin.changeDate.success'),
        detail: t('admin.changeDate.successDetail'),
        life: 5000
    })

    // Update app config
    appStore.fetchConfig()
}
</script>
