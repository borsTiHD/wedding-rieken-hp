<template>
    <Button :label="t('user.upgradeUserRole.submit')" severity="success" icon="pi pi-gift" raised :loading="loading" @click="handleSubmit" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import useInvitiationToken from '@/composables/useInvitiationToken'

// Composables
const toast = useToast()
const { t } = useI18n()
const { changeRoleToInvited } = useFirebaseUserProfile()
const { getInvitiationToken } = useInvitiationToken()

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async() => {
    loading.value = true

    // Check if user has an invitation token
    // And change profile role to 'invited'
    // Firebase will check if the token is valid
    const token = getInvitiationToken()
    if (token && token !== '') {
        const check = await changeRoleToInvited(token).catch((error: { message: string }) => {
            toast.add({
                severity: 'error',
                summary: t('user.upgradeUserRole.error'),
                detail: error.message,
                life: 10000
            })
        })

        // Role change failed
        if (!check) {
            loading.value = false
            return false
        }

        // Role change success
        toast.add({
            severity: 'success',
            summary: t('user.upgradeUserRole.success'),
            detail: t('user.upgradeUserRole.successDetail'),
            life: 10000
        })
    } else {
        // No token provided
        toast.add({
            severity: 'error',
            summary: t('user.upgradeUserRole.error'),
            detail: t('user.upgradeUserRole.noToken'),
            life: 10000
        })
    }

    loading.value = false
}
</script>
