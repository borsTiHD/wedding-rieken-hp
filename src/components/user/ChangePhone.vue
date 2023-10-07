<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                v-model="defaultPhone"
                type="tel"
                name="phone"
                :label="t('user.phone.formkit.label')"
                :help="t('user.phone.formkit.help')"
                placeholder="+49123456789"
                :validation="[['required'],['matches', /^(?:\+[1-9]\d{0,2}|0)\d{4,}$/]]"
                validation-visibility="dirty"
                autofocus
            />

            <div class="flex gap-2">
                <Button :label="t('buttons.submit')" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import type { PartialUserProfile } from '@/types/UserProfile'

// Emit event
const emit = defineEmits(['changed'])

// Composables
const toast = useToast()
const { t } = useI18n()
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const phoneNumber = computed(() => userProfile.value.phoneNumber)

// Data
const loading = ref(false)
const defaultPhone = ref(phoneNumber.value)

// Submit button
const handleSubmit = async(form: { phone: string }) => {
    if (phoneNumber.value === form.phone) {
        toast.add({
            severity: 'info',
            summary: t('user.phone.notChangedInfo'),
            detail: t('user.phone.notChangedInfoDetail'),
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Update users phonenumber
    const data: PartialUserProfile = { phoneNumber: form.phone }
    const response = await changeAdditionalUserProfileData(data).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.phone.error'),
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
            summary: t('user.phone.success'),
            detail: t('user.phone.successDetail'),
            life: 10000
        })

        // Emit event to parent
        emit('changed')
    }
}
</script>
