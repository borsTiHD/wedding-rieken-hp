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
                label="Name"
                help="Bitte geben Sie Ihren Vor- und Nachnahmen ein."
                validation="required|length:5"
                autofocus
            />

            <div class="flex gap-2">
                <Button label="Name ändern" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
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
            summary: 'Name nicht geändert',
            detail: 'Sie haben Ihren Namen nicht geändert.',
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
            summary: 'Fehler beim Ändern',
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
        toast.add({ severity: 'success', summary: 'Name geändert', detail: 'Sie haben Ihren Namen erfolgreich geändert.', life: 3000 })

        // Emit event to parent
        emit('changed')
    }
}
</script>
