<template>
    <div class="m-4 flex flex-col gap-4">
        <div class="p-4 border border-gray-400">
            <LoginForm v-if="!user" />
            <LogoutUser v-if="user" />
        </div>

        <div class="flex flex-col gap-2">
            <pre class="whitespace-pre-wrap">{{ userProfile }}</pre>
        </div>

        <div v-if="user && userProfile?.role === 'admin'" class="flex flex-col gap-4">
            <ShowCountdown :timestamp="config?.weddingDate" />
            <DateDisplay :timestamp="config?.weddingDate" />
            <ChangeTimestamp />
            <CreateUser />
            <ListUsers />
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

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
