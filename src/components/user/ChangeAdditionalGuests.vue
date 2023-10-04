<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                type="number"
                name="additionalGuests"
                label="Zusätzliche Gäste"
                placeholder="0"
                help="Bitte geben Sie eine Anzahl an zusätzlichen Gästen an, die Sie mitbringen würden."
                validation="required|min:0|max:10"
                validation-visibility="dirty"
                autofocus
            />

            <div class="flex gap-2">
                <Button label="Anzahl ändern" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
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
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const additionalGuests = computed(() => userProfile.value.additionalGuests)

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { additionalGuests: number }) => {
    if (additionalGuests.value === form.additionalGuests) {
        toast.add({
            severity: 'info',
            summary: 'Anzahl nicht geändert',
            detail: 'Sie haben die Anzahl nicht geändert.',
            life: 3000
        })
        return false
    }

    // TODO: Ask how many guests the user is allowed to bring

    // Start loading
    loading.value = true

    // Update users profile
    const data: PartialUserProfile = { additionalGuests: form.additionalGuests }
    const response = await changeAdditionalUserProfileData(data).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Ändern der Anzahl zusätzlicher Gäste',
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
        toast.add({ severity: 'success', summary: 'Anzahl geändert', detail: 'Sie haben die Anzahl zusätzlicher Gäste erfolgreich geändert.', life: 10000 })

        // Emit event to parent
        emit('changed')
    }
}
</script>
