<template>
    <main class="content-wrapper">
        <!-- User not logged in -->
        <Card v-if="!uid">
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
            <DisplayAvatarWithInfo />

            <!-- User information -->
            <DisplayUserprofile />
        </div>
    </main>
</template>

<script setup lang="ts">
import DisplayAvatarWithInfo from '@/components/user/DisplayAvatarWithInfo.vue'
import DisplayUserprofile from '@/components/user/DisplayUserprofile.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
