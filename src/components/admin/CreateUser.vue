<template>
    <div class="p-2 flex flex-col gap-4 border border-gray-400">
        <h1 class="text-3xl font-bold underline text-sky-600">Create User:</h1>
        <Button label="Create New User" icon="pi pi-check" @click="createUser" />
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

const createUser = async() => {
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
            name: 'Test User',
            email: 'testUser@borstihd.de',
            password: 'Ys!PbQ4mM@f8!zy4rdCBycq7@DZyrz',
            role: 'user'
        }
    }).catch((error: { statusMessage: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
        throw error
    })

    // Check if response is ok
    if (!response.result) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Response not ok. User not created.', life: 10000 })
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
