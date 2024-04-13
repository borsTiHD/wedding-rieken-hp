<template>
    <Card class="card-primary" :pt="ptCard">
        <template #content>
            <div class="flex items-center gap-4">
                <div class="flex items-center">
                    <div>
                        <img v-if="photoURL" class="inline-block h-14 w-14 rounded-full" :src="photoURL" alt="Your profile picture">
                        <span v-else class="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100" alt="No profile picture">
                            <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    </div>
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
import DisplayProfileProgress from '@/components/user/DisplayProfileProgress.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()

// User data from store
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)
const photoURL = computed(() => userStore.photoURL)

// Card pass-through props
const ptCard = {
    body: {
        class: 'p-4'
    },
    content: {
        class: 'p-0 sm:m-4'
    }
}
</script>
