<template>
    <!-- User not logged in -->
    <div v-if="!uid" class="flex flex-col gap-4">
        <h1 class="text-2xl">{{ t('login.notLoggedIn') }}</h1>
        <i18n-t keypath="login.loginLink" tag="span">
            <template #action>
                <NuxtLink to="login" class="font-medium text-blue-600">{{ t('login.loginLinkTag') }}</NuxtLink>
            </template>
        </i18n-t>
    </div>

    <!-- User Details -->
    <div v-else class="flex flex-col gap-4">
        <!-- User profile picture -->
        <DisplayAvatar />

        <!-- User information -->
        <DisplayUserprofile />
    </div>
</template>

<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import DisplayUserprofile from '@/components/user/DisplayUserprofile.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
