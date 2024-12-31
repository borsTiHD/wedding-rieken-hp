<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                v-model="email"
                type="email"
                name="email"
                :placeholder="t('login.formkit.labelEmail')"
                validation="required|email"
                autofocus
            />
            <FormKit
                type="password"
                name="password"
                :placeholder="t('login.formkit.labelPassword')"
                validation="required"
            />

            <div class="flex justify-between mb-4">
                <!-- Forgot password button -->
                <ForgotPassword :email="email" />

                <!-- Register link -->
                <NuxtLink :to="localePath('/register')">
                    <Button class="whitespace-nowrap p-2" :label="t('register.submit')" text size="small" />
                </NuxtLink>
            </div>

            <Button :label="t('login.submit')" icon="pi pi-sign-in" type="submit" raised :loading="loading" :disabled="!valid" />
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import ForgotPassword from '@/components/user/ForgotPassword.vue'

// Composables
const toast = useToast()
const { t } = useI18n()
const localePath = useLocalePath()
const { loginUser } = useFirebaseAuth()

// Data
const loading = ref(false)
const email = ref('')

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
