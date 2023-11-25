<template>
    <main class="content-wrapper">
        <!-- User not logged in -->
        <Card v-if="!uid" class="card-primary">
            <template #title>
                <h2>{{ t('login.notLoggedIn') }}</h2>
            </template>
            <template #content>
                <div class="flex flex-col gap-4">
                    <i18n-t keypath="login.loginLink" tag="span">
                        <template #action>
                            <NuxtLink :to="localePath('/login')" class="font-medium text-blue-600">{{ t('login.loginLinkTag') }}</NuxtLink>
                        </template>
                    </i18n-t>
                </div>
            </template>
        </Card>

        <!-- User Details -->
        <div v-else class="flex flex-col gap-4">
            <!-- User profile picture -->
            <DisplayAvatar />

            <!-- User settings -->
            <AccountSettings />
        </div>
    </main>
</template>

<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import AccountSettings from '@/components/settings/AccountSettings.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
