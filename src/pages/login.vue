<template>
    <div class="m-4 flex flex-col gap-4">
        <LoginForm v-if="!user" />
        <LogoutUser v-if="user" />
    </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/user/LoginForm.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
</script>
