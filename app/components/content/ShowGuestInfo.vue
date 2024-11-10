<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-yellow-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('welcome.header') }}</h2>
                    </ShowUnderline>
                </div>
                <!-- Normal info if user is logged in and has the right role -->
                <div v-if="!error && whitelistedRoles.includes(userProfile?.role) && userProfile?.invitation !== 'declined'" class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <i18n-t v-if="isBeforeDeadline" keypath="welcome.welcomeMessageForGuest" tag="p">
                        <template #weddingDate>
                            <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
                        </template>
                        <template #deadline>
                            <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
                        </template>
                        <template #action>
                            <NuxtLink :to="localePath('/register')" class="font-medium text-blue-600">{{ t('welcome.loginLinkTag') }}</NuxtLink>
                        </template>
                    </i18n-t>

                    <i18n-t v-else keypath="welcome.welcomeMessageForGuestAfterDeadline" tag="p">
                        <template #weddingDate>
                            <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
                        </template>
                    </i18n-t>
                </div>

                <!-- User is logged in as a guest -->
                <div v-else-if="userProfile?.role === 'guest'" class="flex flex-col justify-center items-center gap-4">
                    <p>{{ t('welcome.errorGuest') }}</p>
                </div>

                <!-- User is logged in, but is declined -->
                <div v-else-if="userProfile?.role === 'declined'" class="flex flex-col justify-center items-center gap-4">
                    <p>{{ t('welcome.errorDeclined') }}</p>
                </div>

                <!-- User is logged in, but has declined the invitation -->
                <div v-else-if="userProfile?.invitation === 'declined'" class="flex flex-col justify-center items-center gap-4">
                    <i18n-t v-if="isBeforeDeadline" keypath="welcome.errorGuestInvitedButDeclined" tag="p">
                        <template #weddingDate>
                            <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
                        </template>
                        <template #deadline>
                            <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
                        </template>
                    </i18n-t>

                    <i18n-t v-else keypath="welcome.errorGuestInvitedButDeclinedAfterDeadline" tag="p">
                        <template #weddingDate>
                            <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
                        </template>
                    </i18n-t>
                </div>

                <!-- User is is probably not logged in or an error occurred -->
                <div v-else class="flex flex-col justify-center items-center gap-4">
                    <p>{{ t('welcome.defaultError') }}</p>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useConfig } from '@/composables/useConfig'
import { useUserStore } from '@/stores/user'
import { whitelistedRoles } from '@/composables/whitelistedRoles'

const { t, d } = useI18n()
const localePath = useLocalePath()

const { weddingDate, deadlineDate, isBeforeDeadline, error } = useConfig()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
</script>
