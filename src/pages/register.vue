<template>
    <div class="m-4 flex flex-col gap-4">
        <RegisterForm v-if="!user" />
        <LogoutUser v-if="user" />
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
