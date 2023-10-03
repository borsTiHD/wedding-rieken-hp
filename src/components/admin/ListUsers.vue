<template>
    <div class="p-2 flex flex-col gap-4 border border-gray-400">
        <h1 class="text-3xl font-bold underline text-sky-600">All Users:</h1>

        <div v-if="loading" class="border-round border-1 surface-border p-4 surface-card">
            <ul class="m-0 p-0 list-none">
                <li class="mb-3">
                    <div class="flex">
                        <div class="align-self-center" style="flex: 1">
                            <Skeleton width="100%" class="mb-2" />
                            <Skeleton width="75%" />
                        </div>
                    </div>
                </li>
                <li class="mb-3">
                    <div class="flex">
                        <div class="align-self-center" style="flex: 1">
                            <Skeleton width="100%" class="mb-2" />
                            <Skeleton width="75%" />
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div v-else class="flex flex-col gap-4">
            <div v-for="user in users" :key="user.account.uid" class="p-4 flex flex-col gap-4 border-2 border-gray-400">
                <h1 class="text-2xl font-bold">DisplayName: {{ user.account.displayName }}</h1>
                <h2 class="text-xl font-bold">Email: {{ user.account.email }}</h2>
                <p class="text-lg">UID: {{ user.account.uid }}</p>
                <p class="text-lg">Role: {{ user.profile.role }}</p>
            </div>
            <Button label="Get Users" icon="pi pi-check" @click="getUsers" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type admin from 'firebase-admin'
import type { UserProfile } from '@/types/UserProfile'

// Type definition for user
type User = {
    account: admin.auth.UserRecord;
    profile: UserProfile;
}

// Composables
const toast = useToast()

// Data
const users = ref<User[]>([])
const loading = ref(false)

const getUsers = async() => {
    loading.value = true

    // Get all users
    const response = await useFetch('/api/users').catch((error: { statusMessage: string }) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error.statusMessage, life: 10000 })
        loading.value = false
        throw error
    })

    // Check if response is ok
    if (!response || !response.data) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Could not get users', life: 10000 })
        loading.value = false
        throw new Error('Could not get users.')
    }

    // Set users
    users.value = response?.data?.value?.result as User[] || []
    loading.value = false
}

onMounted(() => {
    getUsers()
})
</script>
