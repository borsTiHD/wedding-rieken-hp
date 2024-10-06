<template>
    <Card class="grow" :pt="{ content: { class: 'pb-0' } }">
        <template #title>
            <h2>{{ t('admin.inviteToken.header') }}</h2>
        </template>
        <template #content>
            <FormKit
                :id="formId"
                v-slot="{ state: { valid } }"
                type="form"
                :actions="false"
                @submit="handleSubmit"
            >
                <div class="flex flex-col sm:flex-col lg:flex-col items-center gap-4">
                    <Skeleton v-if="loading" width="14rem" height="3rem" />
                    <template v-else>
                        <Message severity="warn" class="w-full">{{ t('admin.inviteToken.infoText') }}</Message>
                        <FormKit
                            v-model="defaultToken"
                            type="text"
                            name="token"
                            outer-class="w-full"
                            :label="t('admin.inviteToken.formkit.label')"
                            validation="required|length:15"
                        />

                        <ConfirmPopup />
                        <Button :label="t('admin.inviteToken.formkit.submit')" class="w-full" icon="pi pi-user-plus" raised :loading="loading" :disabled="!valid" @click="confirmDialog($event)" />
                    </template>
                </div>
            </FormKit>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { submitForm } from '@formkit/core'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()
const confirm = useConfirm()
const { t } = useI18n()
const { queryByCollectionAndId, update } = useFirestore()
const emitter = useEmitter() // Eventbus emitter

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Data
const loading = ref(false)
const defaultToken = ref()
const formId = 'changeTokenForm'

// Confirm dialog
const confirmDialog = (event: MouseEvent) => {
    confirm.require({
        target: event.currentTarget as HTMLElement,
        message: t('admin.inviteToken.confirmMessage'),
        acceptLabel: t('buttons.yes'),
        rejectLabel: t('buttons.no'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 })
            submitForm(formId) // Submit form
        }
    })
}

// Submit button
const handleSubmit = async(form: { token: string }) => {
    loading.value = true
    await changeToken(form).catch(() => { return false })
    loading.value = false
}

// Change token function
const changeToken = async(form: { token: string }) => {
    const newToken = form.token

    // Check if user is logged in
    if (!user.value) {
        throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    // Check if user is admin
    // This is not necessary, because the button is only visible for admins also the API will throw an error if the user is not admin
    if (userProfile.value && userProfile.value.role !== 'admin') {
        throw new Error(t('admin.notAdminError'))
    }

    // Update token
    await update('app', 'admin', 'inviteToken', newToken).catch((error: { message: string }) => {
        toast.add({
            severity: 'error',
            summary: t('admin.inviteToken.error'),
            detail: error.message,
            life: 5000
        })
        throw new Error(error.message)
    })

    // Show toast
    toast.add({
        severity: 'success',
        summary: t('admin.inviteToken.success'),
        detail: t('admin.inviteToken.successDetail'),
        life: 3000
    })

    // Emit event that token has changed
    emitter.$emit('invitation-token-updated')
}

// Get invite token
const getInviteToken = async() => {
    // Check if user is logged in
    if (!user.value) {
        throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    // Check if user is admin
    // This is not necessary, because the button is only visible for admins also the API will throw an error if the user is not admin
    if (userProfile.value && userProfile.value.role !== 'admin') {
        throw new Error(t('admin.notAdminError'))
    }

    // If collection and id is specified, return document from collection
    const response = await queryByCollectionAndId('app', 'admin').catch((error) => {
        const errorMessage = handleFirebaseError(error, 'admin.inviteToken.error')
        throw new Error(errorMessage)
    })

    // Throw error if no response
    if (!response) {
        throw new Error(t('admin.inviteToken.error'))
    }

    // Set token
    defaultToken.value = response.inviteToken as string
}

// On mounted
onMounted(async() => {
    loading.value = true
    await getInviteToken()
    loading.value = false
})
</script>
