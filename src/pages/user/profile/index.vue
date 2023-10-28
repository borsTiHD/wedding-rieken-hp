<template>
    <Card class="card-primary">
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Welcome box -->
                <div class="flex flex-col gap-4">
                    <h1 class="text-4xl">{{ t('profileStepper.index.header') }}</h1>
                    <p>{{ t('profileStepper.index.text') }}</p>
                </div>

                <!-- State incomplete -->
                <div v-if="!checkState" class="flex flex-col gap-4">
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
                    <Button :label="t('profileStepper.buttons.next')" class="ml-auto" :disabled="!checkState" @click="navPage('next')" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
definePageMeta({
    key: (route) => route.fullPath
})

// Emit events to parent to navigate between pages
const emit = defineEmits(['next-page'])
const navPage = (to: 'next') => emit(`${to}-page`)

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.index.header')))
</script>
