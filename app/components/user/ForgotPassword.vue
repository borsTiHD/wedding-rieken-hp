<template>
    <ConfirmPopup />
    <InputPrompt ref="inputPrompt" />
    <Button class="whitespace-nowrap p-0 sm:p-2" :label="t('user.password.resetPassword.forgotButton')" text size="small" :loading="loading" @click="confirmDialog($event)" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import InputPrompt from '@/components/InputPrompt.vue'

const props = defineProps<{
    email: string
}>()

// Refs
const inputPrompt = ref<InstanceType<typeof InputPrompt>>()
const email = ref(props.email)
const loading = ref(false)

// Composables
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()
const { sendUserPasswordResetEmail } = useFirebaseAuth()

// Confirm dialog
const confirmDialog = async(event: MouseEvent) => {
    // Set email from props
    email.value = props.email

    // Check if email is set and show input prompt if not
    if (!email.value || email.value === '') {
        const userInput: { email: string } | false = await inputPrompt.value?.show({
            title: t('user.password.resetPassword.modalHeader'),
            message: t('user.password.resetPassword.askForMail'),
            okButton: t('user.password.resetPassword.submitButton'),
            cancelButton: t('user.password.resetPassword.cancleButton'),
            formKitSchema: [{
                $cmp: 'FormKit',
                props: {
                    type: 'email',
                    name: 'email',
                    validation: 'required|length:2|email'
                }
            }]
        }).catch((error) => {
            console.error(error)
            return false
        }) as { email: string } || false

        // User canceled
        if (!userInput) {
            toast.add({
                severity: 'error',
                summary: t('user.password.resetPassword.error'),
                detail: t('user.password.resetPassword.noMail'),
                life: 10000
            })
            return false
        }

        // Set email from prompt and submit
        email.value = userInput.email
        submit()
        return true
    }

    // Show confirm dialog and submit the email from props
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: t('user.password.resetPassword.confirmMessage'),
        acceptLabel: t('buttons.yes'),
        rejectLabel: t('buttons.no'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            submit() // Submit Button
        }
    })
}

// Submit password reset
const submit = async() => {
    // Start loading
    loading.value = true

    // Send password reset email
    const response = await sendUserPasswordResetEmail(email.value).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.password.resetPassword.error'),
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
            summary: t('user.password.resetPassword.success'),
            detail: t('user.password.resetPassword.successDetail'),
            life: 3000
        })
    }
}
</script>
