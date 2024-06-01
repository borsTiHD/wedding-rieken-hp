<template>
    <!-- Normal size -->
    <Button v-if="!props.small" :label="t('user.upgradeUserRole.submit')" class="pulse-green" severity="success" icon="pi pi-gift" raised :loading="loading" @click="handleSubmit" />

    <!-- Small size -->
    <Button v-else v-tooltip.bottom="t('user.upgradeUserRole.submit')" class="pulse-green" severity="success" icon="pi pi-gift" raised rounded :loading="loading" @click="handleSubmit" />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import { useTokenStore } from '@/stores/token'

type Props = { small?: boolean }
const props = withDefaults(defineProps<Props>(), {
    small: false
})

// Composables
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { changeRoleToInvited } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async() => {
    loading.value = true

    // Check if user is logged in
    if (!uid.value) {
        // Push user to welcome page
        router.push(localePath('welcome'))
        loading.value = false
        return false
    }

    // Check if user has an invitation token
    // And change profile role to 'invited'
    // Firebase will check if the token is valid
    if (token.value && token.value !== '') {
        const check = await changeRoleToInvited(token.value).catch((error: { message: string }) => {
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
