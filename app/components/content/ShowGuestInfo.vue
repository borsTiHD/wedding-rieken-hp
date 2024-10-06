<template>
    <Card class="grow">
        <template #content>
            <div class="flex flex-col items-center gap-4">
                <div class="relative inline-block">
                    <ShowUnderline color="text-yellow-400">
                        <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">{{ t('welcome.header') }}</h2>
                    </ShowUnderline>
                </div>
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
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
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useAppStore } from '@/stores/app'

// Composables
const { t, d } = useI18n()
const localePath = useLocalePath()

// App config
const appStore = useAppStore()
const { weddingDate, deadlineDate, isBeforeDeadline } = appStore
</script>
