<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Welcome box -->
                <div class="flex flex-col gap-4">
                    <h1 class="text-4xl">{{ t('profileStepper.index.header') }}</h1>
                    <p>{{ t('profileStepper.index.text') }}</p>
                </div>

                <!-- User not logged in -->
                <div v-if="!uid" class="flex flex-col gap-4">
                    <h1 class="text-2xl">{{ t('login.notLoggedIn') }}:</h1>
                    <p class="flex flex-col">
                        <i18n-t keypath="profileStepper.index.loginLink" tag="span">
                            <template #action>
                                <NuxtLink :to="localePath('/login')" class="font-medium text-blue-600">{{ t('profileStepper.index.linkTag') }}</NuxtLink>
                            </template>
                        </i18n-t>
                        <i18n-t keypath="profileStepper.index.registerLink" tag="span">
                            <template #action>
                                <NuxtLink :to="localePath('/register')" class="font-medium text-blue-600">{{ t('profileStepper.index.linkTag') }}</NuxtLink>
                            </template>
                        </i18n-t>
                    </p>
                </div>

                <div class="flex">
                    <Button :label="t('profileStepper.buttons.next')" class="ml-auto" :disabled="!uid" @click="navPage('next')" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

definePageMeta({
    key: (route) => route.fullPath
})

// Emit events to parent to navigate between pages
const emit = defineEmits(['next-page'])
const navPage = (to: 'next') => emit(`${to}-page`)

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
</script>
