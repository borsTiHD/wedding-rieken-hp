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
                :label="t('user.password.formkit.labelNew')"
                :help="t('user.password.formkit.labelNewHelp')"
                prefix-icon="password"
                suffix-icon="eyeClosed"
                validation="required"
                validation-visibility="live"
                @suffix-icon-click="handleShowPassword"
            />
            <FormKit
                type="password"
                name="password_confirm"
                :label="t('user.password.formkit.labelNewRepeat')"
                :help="t('user.password.formkit.labelNewRepeatHelp')"
                prefix-icon="password"
                suffix-icon="eyeClosed"
                validation="required|confirm"
                validation-visibility="live"
                :validation-label="t('user.password.formkit.labelNewRepeatValidation')"
                @suffix-icon-click="handleShowPassword"
            />

            <div class="flex gap-2">
                <Button :label="t('buttons.submit')" icon="pi pi-check" type="submit" raised :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>

    <!-- Re-authenticate user -->
    <DisplayModal ref="reauthenticateModal" :position="modalPosition" :header="t('user.reauthenticate.header')">
        <template #content>
            <ReauthenticateUser @loggedin="reauthenticateModal?.close()" />
        </template>
    </DisplayModal>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import ReauthenticateUser from '@/components/user/ReauthenticateUser.vue'
import { useModalPosition } from '@/composables/useModalPosition'

// Emit event
const emit = defineEmits(['changed'])

// Refs
const reauthenticateModal = ref<InstanceType<typeof DisplayModal>>()

// Composables
const toast = useToast()
const { t } = useI18n()
const { changePassword } = useFirebaseUserProfile()
const { modalPosition } = useModalPosition() // Modal position

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
            summary: t('user.password.notChangedInfo'),
            detail: t('user.password.notChangedInfoDetail'),
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Update users email
    const response = await changePassword(form.password).catch((error: Error) => {
        // If error is reauthentication required, show modal
        if (error.message === 'auth/requires-recent-login') {
            reauthenticateModal.value?.open()
            return false
        }

        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.password.error'),
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
            summary: t('user.password.success'),
            detail: t('user.password.successDetail'),
            life: 3000
        })

        // Emit event to parent
        emit('changed')
    }
}
</script>
