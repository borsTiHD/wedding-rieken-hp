<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                v-model="defaultDisplayName"
                type="text"
                name="name"
                :label="t('user.displayName.formkit.label')"
                :help="t('user.displayName.formkit.help')"
                validation="required|length:5"
                autofocus
            />

            <div class="flex gap-2">
                <Button :label="t('buttons.submit')" icon="pi pi-check" type="submit" raised :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

// Emit event
const emit = defineEmits(['changed'])

// Composables
const toast = useToast()
const { t } = useI18n()
const { changeDisplayName } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const displayName = computed(() => userStore.displayName)

// Data
const loading = ref(false)
const defaultDisplayName = ref(displayName.value || '')

// Submit button
const handleSubmit = async(form: { name: string }) => {
    if (displayName.value === form.name) {
        toast.add({
            severity: 'info',
            summary: t('user.displayName.notChangedInfo'),
            detail: t('user.displayName.notChangedInfoDetail'),
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Update users email
    const response = await changeDisplayName(form.name).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: t('user.displayName.error'),
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
            summary: t('user.displayName.success'),
            detail: t('user.displayName.successDetail'),
            life: 3000
        })

        // Emit event to parent
        emit('changed')
    }
}
</script>
