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
                label="Passwort"
                prefix-icon="password"
                help="Bitte geben Sie Ihr Passwort ein"
                validation="required"
            />

            <div class="flex gap-2">
                <Button label="Passwort ändern" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Emit event
const emit = defineEmits(['loggedin'])

// Composables
const toast = useToast()
const { reauthenticateUser } = useFirebaseAuth()

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { password: string }) => {
    // Start loading
    loading.value = true

    // Reauthenticate user
    const response = await reauthenticateUser(form.password).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Einloggen',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({ severity: 'success', summary: 'Erfolgreich eingeloggt', detail: 'Sie haben sich erfolgreich neu eingeloggt.', life: 3000 })

        // Emit event to parent
        emit('loggedin')
    }
}
</script>
