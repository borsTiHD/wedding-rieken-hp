<template>
    <Button :label="t('logout.submit')" severity="danger" icon="pi pi-sign-out" raised :loading="loading" @click="logout" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Composables
const toast = useToast()
const { t } = useI18n()
const { logoutUser } = useFirebaseAuth()

// Data
const loading = ref(false)

// Submit button
const logout = async() => {
    loading.value = true
    await logoutUser()
        .then(() => {
            toast.add({
                severity: 'success',
                summary: t('logout.success'),
                detail: t('logout.successDetail'),
                life: 3000
            })
        })
        .catch((error: { message: string }) => {
            toast.add({
                severity: 'error',
                summary: t('logout.error'),
                detail: error.message,
                life: 10000
            })
        })
        .finally(() => {
            loading.value = false
        })
}
</script>
