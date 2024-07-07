<template>
    <Card :pt="ptCard">
        <template #content>
            <div class="flex items-center gap-4">
                <div class="flex items-center">
                    <DisplayAvatar />
                    <div class="ml-3">
                        <!-- Display name - second one is on mobile -->
                        <h1 class="text-2xl font-semibold text-gray-700 hidden md:inline">{{ displayName ? t('user.welcome', { name: displayName }) : t('user.noName') }}</h1>
                        <h1 class="text-lg font-semibold text-gray-700 inline md:hidden">{{ displayName ? displayName : t('user.noName') }}</h1>

                        <!-- Email Address -->
                        <p class="text-xs sm:text-base text-gray-500 ">{{ email }}</p>
                    </div>
                </div>

                <!-- Profile progress with link -->
                <DisplayProfileProgress class="ml-auto" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import DisplayProfileProgress from '@/components/user/DisplayProfileProgress.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()

// User data from store
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)

// Card pass-through props
const ptCard = {
    body: {
        class: 'p-4 sm:p-2'
    },
    content: {
        class: 'p-0 sm:m-4'
    }
}
</script>
