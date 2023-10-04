<template>
    <!-- User not logged in -->
    <div v-if="!uid" class="flex flex-col gap-4">
        <h1 class="text-2xl">Sie sind nicht eingeloggt:</h1>
        <span>Klicke <NuxtLink to="login" class="font-medium text-blue-600">hier</NuxtLink> um dich einloggen.</span>
    </div>

    <!-- User Details -->
    <div v-else class="bg-gray-100 py-4 flex flex-col gap-4">
        <div class="w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto flex flex-col gap-4">
            <!-- User profile picture -->
            <DisplayAvatar />

            <!-- User information -->
            <DisplayUserprofile />
        </div>
    </div>
</template>

<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import DisplayUserprofile from '@/components/user/DisplayUserprofile.vue'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
