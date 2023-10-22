<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Header -->
                <h1 class="text-4xl">{{ t('profileStepper.profilePicture.header') }}</h1>

                <!-- State incomplete -->
                <div v-if="!checkState" class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.profilePicture.text') }}</p>
                    <span>TODO: Check Profilbild</span>

                    <span>URL: {{ photoURL }}</span>
                </div>

                <!-- State complete -->
                <div v-else class="flex flex-col gap-4">
                    <p>{{ t('profileStepper.profilePicture.textComplete') }}</p>

                    <span>URL: {{ photoURL }}</span>
                </div>

                <div class="flex">
                    <Button label="Prev page" @click="navPage('prev')" />
                    <Button label="Next page" class="ml-auto" @click="navPage('next')" />
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
const emit = defineEmits(['next-page', 'prev-page'])
const navPage = (to: 'next' | 'prev') => emit(`${to}-page`)

// Localisation
const { t } = useI18n()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.profilePicture.header')))

// User store
const userStore = useUserStore()
const photoURL = computed(() => userStore.photoURL)
</script>
