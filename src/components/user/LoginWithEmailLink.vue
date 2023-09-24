<template>
    <!-- User clicked Email link to login -->
    <div v-if="signInLoading" class="flex flex-col gap-4 items-center">
        <ProgressSpinner />
        <p>Versuche einzuloggen...</p>
    </div>

    <!-- Hint: Email sent to the user -->
    <InlineMessage v-else-if="checkEmail" severity="success">Email verschickt. Bitte überprüfen Sie Ihre E-Mails.</InlineMessage>

    <!-- Form for sending a email to the user -->
    <FormKit
        v-else
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
const { sendEmailLink, loginWithEmailLink } = useFirebaseAuth()

// Data
const loading = ref(false) // Submit button loading
const signInLoading = ref(false) // User clicked Email link to login
const checkEmail = ref(false) // Hint: Email sent to the user

// Submit button
const handleSubmit = async(form: { email: string }) => {
    loading.value = true

    //Check if email is valid
    if (!form.email) {
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Einloggen',
            detail: 'Bitte geben Sie eine E-Mail-Adresse ein.',
            life: 10000
        })
        return false
    }

    // Login user with email link
    const response = await sendEmailLink(form.email).catch((error: { message: string }) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Einloggen',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // If response is true, show hint to check email
    if (response) {
        checkEmail.value = true
        toast.add({
            severity: 'success',
            summary: 'Email verschickt',
            detail: 'Bitte überprüfen Sie Ihre E-Mails.',
            life: 10000
        })
    }

    // Stop loading
    loading.value = false
}

onMounted(async() => {
    // Get url queries
    // Check if this is a login link
    // If yes, login user with email link and show loading spinner
    const query = useRouter().currentRoute.value.query
    if (query?.apiKey && query?.mode === 'signIn') {
        signInLoading.value = true
        await loginWithEmailLink().catch((error) => {
            toast.add({
                severity: 'error',
                summary: 'Fehler beim Einloggen',
                detail: error.message,
                life: 10000
            })
        })
        signInLoading.value = false
    }
})
</script>
