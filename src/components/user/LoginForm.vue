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
                :label="t('login.formkit.labelEmail')"
                :help="t('login.formkit.labelEmailHelp')"
                placeholder="myname@website.com"
                validation="required|email"
                autofocus
            />
            <FormKit
                type="password"
                name="password"
                :label="t('login.formkit.labelPassword')"
                :help="t('login.formkit.labelPasswordHelp')"
                validation="required"
            />

            <div class="flex justify-between mb-4">
                <span class="font-medium">!!Passwort vergessen!!</span>
                <NuxtLink :to="localePath('/register')" class="font-medium">{{ t('register.submit') }}</NuxtLink>
            </div>

            <Button :label="t('login.submit')" icon="pi pi-check" type="submit" raised :loading="loading" :disabled="!valid" />
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Composables
const toast = useToast()
const { t } = useI18n()
const localePath = useLocalePath()
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
            summary: t('login.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // If response is true, user is logged in
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('login.success'),
            detail: t('login.successDetail'),
            life: 3000
        })
    }

    // Stop loading
    loading.value = false
}
</script>
