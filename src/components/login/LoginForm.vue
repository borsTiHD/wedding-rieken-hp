<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col gap-4">
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
                <Button label="Einloggen" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { User} from 'firebase/auth'

// Composables
const toast = useToast()
const { loginUser } = useFirebaseAuth()

// Data
const user = useState<User | null>('user', () => null) // Create a reactive state for the user (nuxt)
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { email: string, password: string }) => {
    loading.value = true
    await loginUser(form.email, form.password)
        .then(() => {
            console.log('logged in', user.value)
            toast.add({
                severity: 'success',
                summary: 'Erfolgreich eingeloggt',
                detail: 'Sie wurden erfolgreich eingeloggt.',
                life: 3000
            })
        })
        .catch((error: { message: string }) => {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Einloggen',
                detail: error.message,
                life: 3000
            })
        })
        .finally(() => {
            loading.value = false
        })
}
</script>
