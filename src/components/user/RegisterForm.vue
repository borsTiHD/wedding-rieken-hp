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
                :label="t('register.formkit.labelEmail')"
                prefix-icon="email"
                placeholder="myname@website.com"
                :help="t('register.formkit.labelEmailHelp')"
                validation="required|email"
                autofocus
            />
            <FormKit
                type="password"
                name="password"
                :label="t('register.formkit.labelPassword')"
                prefix-icon="password"
                :help="t('register.formkit.labelPasswordHelp')"
                validation="required"
            />

            <div class="flex gap-2">
                <Button :label="t('register.submit')" icon="pi pi-check" type="submit" raised :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Localisation
const { t } = useI18n()

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
            summary: t('register.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // If response is true, user is logged in
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('register.success'),
            detail: t('register.successDetail'),
            life: 10000
        })
    }

    // Stop loading
    loading.value = false
}
</script>
