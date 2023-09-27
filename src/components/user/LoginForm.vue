<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                type="email"
                name="email"
                label="Email"
                prefix-icon="email"
                placeholder="myname@website.com"
                help="Bitte geben Sie Ihre E-Mail-Adresse ein"
                validation="required|email"
                autofocus
            />
            <FormKit
                type="password"
                name="password"
                label="Passwort"
                prefix-icon="password"
                help="Bitte geben Sie Ihr Passwort ein"
                validation="required"
            />

            <div class="flex gap-2">
                <Button label="Einloggen" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Composables
const toast = useToast()
const { loginUser } = useFirebaseAuth()

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { email: string, password: string }) => {
    loading.value = true
    const response = await loginUser(form.email, form.password).catch((error: { message: string }) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Einloggen',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // If response is true, user is logged in
    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Erfolgreich eingeloggt',
            detail: 'Sie wurden erfolgreich eingeloggt.',
            life: 3000
        })
    }

    // Stop loading
    loading.value = false
}
</script>
