<template>
    <div class="m-4 flex flex-col gap-4 p-4 border border-gray-400">
        <div v-if="!user.uid" class="flex flex-col gap-4">
            <h1 class="text-2xl">Registrieren:</h1>
            <RegisterForm />
        </div>

        <div v-else class="flex flex-col gap-4">
            <h1 class="text-2xl">Bereits eingeloggt:</h1>
            <LogoutUser />
        </div>
    </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/user/RegisterForm.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
</script>
