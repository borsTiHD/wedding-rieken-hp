<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col gap-4">
            <FormKit
                type="text"
                name="name"
                :label="t('admin.createUser.formkit.labelName')"
                :help="t('admin.createUser.formkit.labelNameHelp')"
                placeholder="Marcel Mustermann"
                validation="required|length:5"
                autofocus
            />
            <FormKit
                type="email"
                name="email"
                :label="t('admin.createUser.formkit.labelEmail')"
                :help="t('admin.createUser.formkit.labelEmailHelp')"
                placeholder="myname@website.com"
                validation="required|email"
                autofocus
            />
            <FormKit
                type="password"
                name="password"
                :label="t('admin.createUser.formkit.labelPassword')"
                :help="t('admin.createUser.formkit.labelPasswordHelp')"
                prefix-icon="password"
                validation="required|length:8"
            />

            <div class="flex gap-2">
                <Button :label="t('admin.createUser.formkit.submit')" icon="pi pi-user-plus" type="submit" raised :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import useBackendApi from '@/composables/useBackendApi'

// Composables
const toast = useToast()
const { t } = useI18n()
const { createUser } = useBackendApi()

// Emit event
const emit = defineEmits(['created'])
const emitter = useEmitter() // Eventbus emitter

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { name: string, email: string, password: string }) => {
    loading.value = true
    await createNewUser(form).catch(() => { return false })
    loading.value = false
}

// Create user function
const createNewUser = async(form: { name: string, email: string, password: string }) => {
    // Send request to API to create user
    const response = await createUser(form.name, form.email, form.password).catch((error: { statusMessage: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
        throw error
    })

    // Check if response is ok
    if (!response.result) {
        toast.add({ severity: 'error', summary: 'Error', detail: t('admin.createUser.error'), life: 10000 })
        throw new Error(t('admin.createUser.error'))
    }

    // Show toast
    toast.add({
        severity: 'success',
        summary: t('admin.createUser.success'),
        detail: t('admin.createUser.successDetail'),
        life: 3000
    })

    // Emit event to reload users
    emitter.$emit('user-created')

    // Emit event to parent
    emit('created')
}
</script>
