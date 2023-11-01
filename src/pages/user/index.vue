<template>
    <main class="content-wrapper">
        <Card v-if="!uid" class="card-primary">
            <template #content>
                <!-- User not logged in -->
                <div class="flex flex-col gap-4">
                    <h1 class="text-2xl">{{ t('login.notLoggedIn') }}</h1>
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

            <!-- User information -->
            <DisplayUserprofile />
        </div>
    </main>
</template>

<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import DisplayUserprofile from '@/components/user/DisplayUserprofile.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
