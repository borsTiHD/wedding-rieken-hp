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
                help="Bitte geben Sie Ihre E-Mail-Adresse ein."
                validation="required|email"
                autofocus
            />
            <FormKit
                type="password"
                name="password"
                label="Password"
                prefix-icon="password"
                help="Bitte geben Sie Ihr Passwort ein."
                validation="required"
            />

            <div class="flex gap-2">
                <Button label="Registrieren" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Composables
const toast = useToast()
const { registerUser } = useFirebaseAuth()

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { email: string, password: string }) => {
    loading.value = true

    // Create user
    const response = await registerUser(form.email, form.password).catch((error: { message: string }) => {
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Registrieren',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // If response is true, user is logged in
    if (response) {
        toast.add({
            severity: 'success',
            summary: 'User erstellt',
            detail: 'Der User wurde erfolgreich erstellt.',
            life: 10000
        })
    }

    // Stop loading
    loading.value = false
}
</script>
