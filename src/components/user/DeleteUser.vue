<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                type="text"
                name="verificationCode"
                :label="t('user.deleteUser.formkit.label')"
                :help="t('user.deleteUser.formkit.help')"
                validation="required|matches:deleteme"
                autofocus
            />

            <div class="flex gap-2">
                <Button :label="t('user.deleteUser.submit')" icon="pi pi-user-minus" severity="danger" type="submit" :loading="loading" :disabled="!valid" />
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

// Emit event
const emit = defineEmits(['deleted'])

// Refs
const reauthenticateModal = ref<InstanceType<typeof DisplayModal>>()

// Composables
const toast = useToast()
const { t } = useI18n()
const { deleteUserAccount } = useFirebaseUserProfile()

// Data
const loading = ref(false)
const verificationCode = 'deleteme'

// Submit button
const handleSubmit = async(form: { verificationCode: string }) => {
    if (verificationCode !== form.verificationCode) {
        toast.add({
            severity: 'info',
            summary: t('user.deleteUser.notChangedInfo'),
            detail: t('user.deleteUser.notChangedInfoDetail'),
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Delete user account
    const response = await deleteUserAccount().catch((error: Error) => {
        // If error is reauthentication required, show modal
        if (error.message === 'auth/requires-recent-login') {
            reauthenticateModal.value?.open()
            return false
        }

        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.deleteUser.error'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('user.deleteUser.success'),
            detail: t('user.deleteUser.successDetail'),
            life: 10000
        })

        // Emit event to parent
        emit('deleted')
    }
}
</script>
