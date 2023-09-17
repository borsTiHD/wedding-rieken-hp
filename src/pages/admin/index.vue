<template>
    <div class="m-4 flex flex-col gap-4">
        <div class="p-4 border border-gray-400">
            <LoginForm v-if="!user" />
            <LogoutButton v-if="user" />
        </div>

        <ShowCountdown :timestamp="config?.weddingDate" />
        <DateDisplay :timestamp="config?.weddingDate" />
        <ChangeTimestamp />
        <ApiTesting />
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import LoginForm from '@/components/user/LoginForm.vue'
import LogoutButton from '@/components/user/LogoutButton.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import ApiTesting from '@/components/ApiTesting.vue'

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)

// User
const { user } = useFirebaseAuth()
</script>
