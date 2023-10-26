<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Header -->
                <div class="flex gap-4">
                    <h1 class="text-4xl">{{ t('profileStepper.profilePicture.header') }}</h1>
                    <i v-if="checkState" v-tooltip.bottom="t('profileStepper.stateComplete')" class="text-2xl pi pi-verified text-green-600" />
                    <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="text-2xl pi pi-exclamation-circle text-sky-600" />
                </div>

                <!-- State incomplete -->
                <div v-if="!checkState" class="flex gap-4">
                    <p>{{ t('profileStepper.profilePicture.text') }}</p>
                </div>

                <!-- State complete -->
                <div v-else class="flex gap-4">
                    <p>{{ t('profileStepper.profilePicture.textComplete') }}</p>
                </div>

                <!-- User avatar with edit icon on mouse hover -->
                <div class="flex items-center justify-center gap-4">
                    <div class="relative inline-block h-72 w-72">
                        <div
                            class="cursor-pointer flex items-center justify-center"
                            @mouseover="showProfilePictureEditIcon = true"
                        >
                            <img v-if="photoURL" :src="photoURL" :alt="`Your profile picture`" class="h-72 w-72 object-cover shadow-md rounded-md">
                            <div v-else class="h-72 w-72 shadow-md rounded-md bg-gray-200 flex items-center justify-center">
                                <span class="text-gray-400 text-center">No Avatar</span>
                            </div>
                        </div>

                        <!-- Edit profile picture on mouse hover -->
                        <div
                            v-if="showProfilePictureEditIcon"
                            class="absolute inset-0 rounded-md flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
                            @mouseleave="showProfilePictureEditIcon = false"
                            @click="profilePictureModal?.open()"
                        >
                            <i class="pi pi-pencil text-white" />
                        <!-- <Button icon="pi pi-pencil" rounded aria-label="Profilbild editieren" /> -->
                        </div>

                        <!-- Profile picture edit modal -->
                        <DisplayModal ref="profilePictureModal" :header="t('user.profilePicture.modalHeader')">
                            <template #content>
                                <UploadProfilePicture @uploaded="profilePictureModal?.close()" />
                            </template>
                        </DisplayModal>
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
import DisplayModal from '@/components/DisplayModal.vue'
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

// Refs
const profilePictureModal = ref<InstanceType<typeof DisplayModal>>()
const showProfilePictureEditIcon = ref(false)

// User store
const userStore = useUserStore()
const photoURL = computed(() => userStore.photoURL)
</script>
