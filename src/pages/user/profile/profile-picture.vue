<template>
    <Card class="card-primary">
        <template #title>
            <div class="flex gap-4">
                <h2>{{ t('profileStepper.profilePicture.header') }}</h2>
                <i v-if="checkState" v-tooltip.bottom="t('profileStepper.stateComplete')" class="text-2xl pi pi-verified text-green-600" />
                <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="text-2xl pi pi-exclamation-circle text-sky-600" />
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- State incomplete -->
                <div v-if="!checkState" class="flex gap-4">
                    <p>{{ t('profileStepper.profilePicture.text') }}</p>
                </div>

                <!-- State complete -->
                <div v-else class="flex gap-4">
                    <p>{{ t('profileStepper.profilePicture.textComplete') }}</p>
                </div>

                <!-- User avatar -->
                <div class="flex items-center justify-center gap-4">
                    <div class="col-span-full flex flex-col sm:flex-row items-center gap-8">
                        <img v-if="photoURL" :src="photoURL" alt="Your profile picture" class="h-48 w-48 sm:h-64 sm:w-64 bg-gray-800 object-cover shadow-md rounded-md">
                        <div v-else class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div class="text-center">
                                <i class="pi pi-image text-6xl text-gray-300" />
                            </div>
                        </div>
                        <div>
                            <UploadProfilePicture />
                            <p class="mt-2 text-xs leading-5 text-gray-400">JPG, GIF or PNG. 10MB max.</p>
                        </div>
                    </div>
                </div>

                <div class="flex">
                    <Button :label="t('profileStepper.buttons.back')" @click="navPage('prev')" />
                    <Button :label="t('profileStepper.buttons.next')" class="ml-auto" @click="navPage('next')" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
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
