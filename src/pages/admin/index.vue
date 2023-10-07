<template>
    <div class="m-4 flex flex-col gap-4">
        <!-- You are not logged in -->
        <div class="p-4 border border-gray-400">
            <LoginForm v-if="!user.uid" />
            <LogoutUser v-else />
        </div>

        <!-- You are an admin -->
        <div v-if="user.uid && userProfile?.role === 'admin'" class="flex flex-col gap-4">
            <ShowCountdown :timestamp="config?.weddingDate" />
            <DateDisplay :timestamp="config?.weddingDate" />
            <ChangeTimestamp />
            <CreateUser />
            <ListUsers />
        </div>

        <!-- You are not an admin -->
        <div v-else-if="user.uid">
            <h1 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/user/LoginForm.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import CreateUser from '@/components/admin/CreateUser.vue'
import ListUsers from '@/components/admin/ListUsers.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
