<template>
    <Button label="Ausloggen" severity="danger" icon="pi pi-sign-out" :loading="loading" @click="logout" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Composables
const toast = useToast()
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
                summary: 'Erfolgreich ausgeloggt',
                detail: 'Sie wurden erfolgreich ausgeloggt.',
                life: 3000
            })
        })
        .catch((error: { message: string }) => {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Ausloggen',
                detail: error.message,
                life: 10000
            })
        })
        .finally(() => {
            loading.value = false
        })
}
</script>
