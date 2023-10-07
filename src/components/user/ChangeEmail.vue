<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                v-model="defaultMail"
                type="email"
                name="email"
                :label="t('user.email.formkit.label')"
                :help="t('user.email.formkit.help')"
                placeholder="myname@website.com"
                validation="required|email"
                autofocus
            />

            <div class="flex gap-2">
                <Button :label="t('buttons.submit')" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>

    <!-- Re-authenticate user -->
    <DisplayModal ref="reauthenticateModal" :header="t('user.reauthenticate.header')">
        <template #content>
            <ReauthenticateUser @loggedin="reauthenticateModal?.close()" />
        </template>
    </DisplayModal>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import ReauthenticateUser from '@/components/user/ReauthenticateUser.vue'
import { useUserStore } from '@/stores/user'

// Emit event
const emit = defineEmits(['changed'])

// Refs
const reauthenticateModal = ref<InstanceType<typeof DisplayModal>>()

// Composables
const toast = useToast()
const { t } = useI18n()
const { changeEmail } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const email = computed(() => userStore.email)

// Data
const loading = ref(false)
const defaultMail = ref(email.value || '')

// Submit button
const handleSubmit = async(form: { email: string }) => {
    if (email.value === form.email) {
        toast.add({
            severity: 'info',
            summary: t('user.email.notChangedInfo'),
            detail: t('user.email.notChangedInfoDetail'),
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Update users email
    const response = await changeEmail(form.email).catch((error: Error) => {
        // If error is reauthentication required, show modal
        if (error.message === 'auth/requires-recent-login') {
            reauthenticateModal.value?.open()
            return false
        }

        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.email.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Update user
    userStore.refreshUserProfile()

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('user.email.success'),
            detail: t('user.email.successDetail'),
            life: 10000
        })

        // Emit event to parent
        emit('changed')
    }
}
</script>
