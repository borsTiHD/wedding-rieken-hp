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
                :label="t('admin.witnesses.newWitness.formkit.labelName')"
                :help="t('admin.witnesses.newWitness.formkit.labelNameHelp')"
                placeholder="zb. Max Mustermann"
                validation="required|length:3"
            />
            <FormKit
                type="text"
                name="phone"
                :label="t('admin.witnesses.newWitness.formkit.labelPhone')"
                :help="t('admin.witnesses.newWitness.formkit.labelPhoneHelp')"
                placeholder="zb. 0123456789"
                validation="required|length:3"
            />

            <div class="flex gap-2">
                <Button :label="t('admin.witnesses.newWitness.formkit.submit')" icon="pi pi-user-plus" type="submit" raised :loading="loading || isFetching" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useContent } from '@/composables/useContent'

type FormData = {
    name: string
    phone: string
}

// Composables
const toast = useToast()
const { t } = useI18n()

// Emit event
const emit = defineEmits(['created'])

// Content
const { isFetching, refetch, addWitness } = useContent()

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: FormData) => {
    loading.value = true
    await createNewWitness(form).catch(() => { return false })
    loading.value = false
}

// Create new witness function
const createNewWitness = async(form: FormData) => {
    const newItem = {
        name: form.name,
        phone: form.phone
    }

    await addWitness(newItem).then(async() => {
        await refetch() // Refresh content
        toast.add({ severity: 'success', summary: t('admin.witnesses.newWitness.success'), life: 3000 })
    }).catch((error) => {
        const errorMessage = handleFirebaseError(error, 'admin.witnesses.newWitness.error')
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 10000 })
        return undefined
    })

    // Emit event to parent
    emit('created')
}
</script>
