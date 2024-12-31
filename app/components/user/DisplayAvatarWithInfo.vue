<template>
    <Card :pt="ptCard">
        <template #content>
            <div class="flex items-center gap-4">
                <div class="flex items-center">
                    <DisplayAvatar circle />
                    <div class="ml-3">
                        <!-- Display name - second one is on mobile -->
                        <h1 class="text-2xl font-semibold text-gray-700 hidden md:inline">{{ displayName ? t('user.welcome', { name: displayName }) : t('user.noName') }}</h1>
                        <h1 class="text-lg font-semibold text-gray-700 inline md:hidden">{{ displayName ? displayName : t('user.noName') }}</h1>

                        <!-- Email Address -->
                        <p class="text-xs sm:text-base text-gray-500 ">{{ email }}</p>
                    </div>
                </div>

                <div v-if="checkState < 100" class="ml-auto flex gap-2 items-center px-0 sm:px-8 cursor-pointer hover:text-neutral-400">
                    <!-- Icon for mobile -->
                    <i v-if="isWidthSmall" class="pi pi-arrow-right animate-bounce" />

                    <!-- Text for desktop -->
                    <NuxtLink v-else :to="localePath('/user/profile/')" class="flex items-center gap-2">
                        <span>{{ t('userQuickMenu.completeProfile') }}</span>
                        <i class="pi pi-arrow-right animate-bounce" />
                    </NuxtLink>

                    <!-- Profile progress with link -->
                    <DisplayProfileProgress />
                </div>

                <!-- Profile progress with link -->
                <DisplayProfileProgress v-else class="ml-auto" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import DisplayProfileProgress from '@/components/user/DisplayProfileProgress.vue'
import { useWindowSize } from '@/composables/useWindowSize'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// User store
const userStore = useUserStore()

// Profile checker
const { checkState } = useProfileChecker()

// Window size for mobile check
const { windowWidth } = useWindowSize(100)
const isWidthSmall = computed<boolean>(() => windowWidth.value < 640)

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
