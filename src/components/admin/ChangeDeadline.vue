<template>
    <Card class="grow">
        <template #title>
            <h2>{{ t('admin.changeDeadline.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <Message severity="warn" class="w-full">{{ t('admin.changeDeadline.infoText') }}</Message>
                <ChangeTimestamp :timestamp="config?.deadline.seconds" @change="changeDeadlineTimestamp" />
                <div class="flex gap-4">
                    <span class="text-2xl">{{ t('admin.changeDeadline.label') }}:</span>
                    <DateDisplay :timestamp="config?.deadline.seconds" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { Timestamp } from '@firebase/firestore'
import DateDisplay from '@/components/DateDisplay.vue'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useAppStore } from '@/stores/app'
import type { PartialConfig } from '@/types/Config'

// Composables
const { t } = useI18n() // Localisation
const toast = useToast()

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)

// Change wedding date
const changeDeadlineTimestamp = async(newTimestamp: Date) => {
    // Convert timestamp to firestore timestamp
    const firestoreTimestamp = Timestamp.fromDate(newTimestamp)

    const config: PartialConfig = {
        deadline: firestoreTimestamp
    }

    // Update wedding date
    await appStore.updateConfig(config).catch((error) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
        toast.add({
            severity: 'error',
            summary: t('admin.changeDeadline.error'),
            detail: errorMessage,
            life: 5000
        })
        throw new Error(error.message)
    })

    // Show success message
    toast.add({
        severity: 'success',
        summary: t('admin.changeDeadline.success'),
        detail: t('admin.changeDeadline.successDetail'),
        life: 5000
    })

    // Update app config
    appStore.fetchConfig()
}
</script>
