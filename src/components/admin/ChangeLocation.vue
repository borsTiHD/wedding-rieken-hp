<template>
    <Card class="card-primary grow">
        <template #title>
            <h2>{{ t('admin.changeLocation.header') }}</h2>
        </template>
        <template #content>
            <FormKit
                :id="formId"
                v-slot="{ state: { valid } }"
                type="form"
                :actions="false"
                @submit="handleSubmit"
            >
                <div class="flex flex-wrap items-center gap-4">
                    <FormKit
                        v-model="defaultStreet"
                        type="text"
                        name="street"
                        outer-class="flex-1 w-full"
                        :label="t('admin.changeLocation.street')"
                        validation="required|length:5"
                    />
                    <FormKit
                        v-model="defaultCity"
                        type="text"
                        name="city"
                        outer-class="flex-1 w-full"
                        :label="t('admin.changeLocation.city')"
                        validation="required|length:5"
                    />
                    <Button :label="t('admin.changeLocation.submit')" class="basis-full" icon="pi pi-map-marker" raised :loading="loading" :disabled="!valid" @click="submitForm(formId)" />
                </div>
            </FormKit>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { submitForm } from '@formkit/core'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useAppStore } from '@/stores/app'
import type { PartialConfig } from '@/types/Config'

// Composables
const { t } = useI18n() // Localisation
const toast = useToast()

// App config
const appStore = useAppStore()

// Data
const loading = ref(false)
const defaultStreet = ref(appStore.street)
const defaultCity = ref(appStore.city)
const formId = 'changeLocationForm'

type FormValues = {
    street: string
    city: string
}

// Submit button
const handleSubmit = async(form: FormValues) => {
    loading.value = true
    await changeLocation(form).catch(() => { return false })
    loading.value = false
}

// Change location
const changeLocation = async(form: FormValues) => {
    // Create config object
    const config: PartialConfig = {
        street: form.street,
        city: form.city
    }

    // Update config
    await appStore.updateConfig(config).catch((error) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigUpdateFailed')
        toast.add({
            severity: 'error',
            summary: t('admin.changeLocation.error'),
            detail: errorMessage,
            life: 5000
        })
        throw new Error(error.message)
    })

    // Show success message
    toast.add({
        severity: 'success',
        summary: t('admin.changeLocation.success'),
        detail: t('admin.changeLocation.successDetail'),
        life: 5000
    })

    // Update app config
    appStore.fetchConfig()
}
</script>
