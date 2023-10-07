<template>
    <div class="bg-white p-4 shadow-md rounded-lg">
        <div class="flex items-center space-x-4">
            <!-- User avatar with edit icon on mouse hover -->
            <div class="relative inline-block">
                <Avatar
                    :image="photoURL ? photoURL : undefined"
                    :icon="photoURL ? undefined : 'pi pi-user'"
                    class="cursor-pointer"
                    size="xlarge"
                    shape="circle"
                    @mouseover="showProfilePictureEditIcon = true"
                />

                <!-- Edit profile picture on mouse hover -->
                <div
                    v-if="showProfilePictureEditIcon"
                    class="absolute inset-0 mb-1 flex items-center justify-center rounded-full bg-black bg-opacity-50 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
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
            <div class="flex flex-col">
                <!-- Display name -->
                <h1 class="text-2xl font-semibold">{{ displayName ? t('user.welcome', { name: displayName }) : t('user.noName') }}</h1>

                <!-- Email Address -->
                <div class="flex items-center gap-2">
                    <p class="text-gray-600">{{ email }}</p>
                    <i v-if="emailVerified" v-tooltip.bottom="t('user.email.verified')" class="pi pi-verified text-green-600" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// Refs
const profilePictureModal = ref<InstanceType<typeof DisplayModal>>()
const showProfilePictureEditIcon = ref(false)

// User store
const userStore = useUserStore()

// User data from store
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)
const emailVerified = computed(() => userStore.emailVerified)
const photoURL = computed(() => userStore.photoURL)
</script>
