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
                suffix-icon="eyeClosed"
                help="Bitte geben Sie ein neues Passwort ein"
                validation="required"
                validation-visibility="live"
                @suffix-icon-click="handleShowPassword"
            />
            <FormKit
                type="password"
                name="password_confirm"
                label="Bestätige das Passwort"
                prefix-icon="password"
                suffix-icon="eyeClosed"
                help="Bestätigen Sie das neue Passwort"
                validation="required|confirm"
                validation-visibility="live"
                validation-label="Passwort Bestätigung"
                @suffix-icon-click="handleShowPassword"
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
const emit = defineEmits(['changed'])

// Composables
const toast = useToast()
const { changePassword } = useFirebaseUserProfile()

// Data
const loading = ref(false)

// Handle show password icon
interface FormKitProps { type: string; suffixIcon: string; } // Formkit types
const handleShowPassword = (node: { props: FormKitProps }) => {
    node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
    node.props.type = node.props.type === 'password' ? 'text' : 'password'
}

// Submit button
const handleSubmit = async(form: { password: string, password_confirm: string }) => {
    // Check if passwords are not equal
    if (form.password !== form.password_confirm) {
        toast.add({
            severity: 'info',
            summary: 'Passwort nicht geändert',
            detail: 'Die Passwörter stimmen nicht überein',
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Update users email
    const response = await changePassword(form.password).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Ändern des Passworts',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({ severity: 'success', summary: 'Passwort geändert', detail: 'Sie haben Ihr Passwort erfolgreich geändert.', life: 3000 })

        // Emit event to parent
        emit('changed')
    }
}
</script>
