<template>
    <Button label="Passwort zurücksetzen" icon="pi pi-lock-open" :loading="loading" @click="handleSubmit" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Refs
const loading = ref(false)

// Composables
const toast = useToast()
const { sendUserPasswordResetEmail } = useFirebaseAuth()

// Submit button
const handleSubmit = async() => {
    // Start loading
    loading.value = true

    // Update users email
    const response = await sendUserPasswordResetEmail().catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Zurücksetzen des Passworts',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({ severity: 'success', summary: 'Passwort zurückgesetzt', detail: 'Eine Email mit weiteren Schritten wurde an dein Postfach versendet.', life: 3000 })
    }
}
</script>
