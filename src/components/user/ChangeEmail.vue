<template>
    <FormKit
        v-slot="{ state: { valid } }"
        type="form"
        :actions="false"
        @submit="handleSubmit"
    >
        <div class="flex flex-col">
            <FormKit
                v-model="defaultMail"
                type="email"
                name="email"
                label="Email"
                prefix-icon="email"
                placeholder="myname@website.com"
                help="Bitte geben Sie Ihre E-Mail-Adresse ein."
                validation="required|email"
                autofocus
            />

            <div class="flex gap-2">
                <Button label="Email ändern" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
            </div>
        </div>
    </FormKit>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['changed'])

// Composables
const toast = useToast()
const { changeEmail } = useFirebaseUserProfile()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)

// Data
const loading = ref(false)
const defaultMail = ref('')

// Submit button
const handleSubmit = async(form: { email: string }) => {
    if (user.value?.email === form.email) {
        toast.add({
            severity: 'info',
            summary: 'Email nicht geändert',
            detail: 'Sie haben keine neue Email Adresse angegeben.',
            life: 3000
        })
        return false
    }

    // Start loading
    loading.value = true

    // Update users email
    const response = await changeEmail(form.email).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Ändern der Email Adresse',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Stop loading
    loading.value = false

    // Show success toast
    if (response) {
        toast.add({ severity: 'success', summary: 'Email geändert', detail: 'Sie haben Ihre Email Adresse erfolgreich geändert.', life: 3000 })

        // Emit event to parent
        emit('changed')
    }
}

onMounted(() => {
    // Set default mail to current user email
    defaultMail.value = user.value?.email || ''
})
</script>
