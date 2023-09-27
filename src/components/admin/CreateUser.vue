<template>
    <div class="p-2 flex flex-col gap-4 border border-gray-400">
        <h1 class="text-3xl font-bold underline text-sky-600">Create User:</h1>
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
                    label="Name"
                    prefix-icon="avatarMan"
                    placeholder="Marcel Mustermann"
                    help="Bitte geben Sie Vor-/Nachnahme ein."
                    validation="required|length:5"
                    autofocus
                />
                <FormKit
                    type="email"
                    name="email"
                    label="Email"
                    prefix-icon="email"
                    placeholder="myname@website.com"
                    help="Bitte geben Sie eine E-Mail-Adresse ein."
                    validation="required|email"
                    autofocus
                />
                <FormKit
                    type="password"
                    name="password"
                    label="Password"
                    prefix-icon="password"
                    help="Bitte geben Sie ein Passwort ein."
                    validation="required|length:8"
                />

                <div class="flex gap-2">
                    <Button label="Erstelle User" icon="pi pi-check" type="submit" :loading="loading" :disabled="!valid" />
                </div>
            </div>
        </FormKit>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// Data
const loading = ref(false)

// Submit button
const handleSubmit = async(form: { name: string, email: string, password: string }) => {
    loading.value = true
    await createUser(form).catch(() => { return false })
    loading.value = false
}

// Create user function
const createUser = async(form: { name: string, email: string, password: string }) => {
    // Check if user is logged in
    if (!user.value) {
        throw new Error('User not logged in')
    }

    // Check if user is admin
    // This is not necessary, because the button is only visible for admins also the API will throw an error if the user is not admin
    if (userProfile.value && userProfile.value.role !== 'admin') {
        throw new Error('User is not admin')
    }

    // Generate a random string and push it to the database
    const response = await $fetch('/api/users/add', {
        method: 'POST',
        body: {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'invited'
        }
    }).catch((error: { statusMessage: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
        throw error
    })

    // Check if response is ok
    if (!response.result) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Unbekannter Fehler in der Rückgabe. User konnte nicht angelegt werden.', life: 10000 })
        throw new Error('Response not ok. User not created.')
    }

    // Show toast
    toast.add({
        severity: 'success',
        summary: 'User angelegt',
        detail: 'Der User wurde erfolgreich angelegt.',
        life: 3000
    })
}
</script>
