<template>
    <div v-if="!uid" class="flex flex-col gap-4">
        <h1 class="text-2xl">{{ t('register.header') }}:</h1>
        <RegisterForm />
    </div>

    <div v-else class="flex flex-col gap-4">
        <h1 class="text-2xl">{{ t('login.alreadyLoggedIn') }}</h1>
        <LogoutUser />
    </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/user/RegisterForm.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
