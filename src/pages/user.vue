<template>
    <div class="m-4 flex flex-col gap-4 p-4 border border-gray-400">
        <!-- User not logged in -->
        <div v-if="!user.uid" class="flex flex-col gap-4">
            <h1 class="text-2xl">Sie sind nicht eingeloggt:</h1>
            <span>Klicke <NuxtLink to="login" class="font-medium text-blue-600">hier</NuxtLink> um dich einloggen.</span>
        </div>

        <!-- User Details -->
        <div v-else class="flex flex-col gap-4">
            <h1 class="text-2xl">Benutzer Infos:</h1>
            <Avatar :image="user.photoURL ? user.photoURL : undefined" :icon="user.photoURL ? undefined : 'pi pi-user'" class="mr-2" size="xlarge" shape="circle" />
            <div class="flex flex-col gap-2">
                <span><b>UID:</b> {{ user.uid }}</span>
                <span>
                    <b>Email:</b> {{ user.email }}
                    <i v-if="user.emailVerified" v-tooltip.bottom="'Email Adresse verifiziert'" class="pi pi-verified text-green-600" />
                    <i v-else v-tooltip.bottom="'Bitte verifizieren Sie Ihre Email Adresse'" class="pi pi-exclamation-circle text-blue-600" />
                </span>
                <span><b>Name:</b> {{ user.displayName }}</span>
                <span><b>Telefon:</b> {{ user.phoneNumber }}</span>
                <span><b>Erstellt:</b> {{ createReadableDate(user.metadata.creationTime as string) }}</span>
                <span><b>Zuletzt eingeloggt:</b> {{ createReadableDate(user.metadata.lastSignInTime as string) }}</span>
                <pre>{{ userProfile }}</pre>
            </div>

            <!-- Upload profile picture -->
            <UploadProfilePicture />

            <!-- Change Email -->
            <div class="flex gap-2">
                <DisplayModal ref="emailModal" header="Email ändern" buttonLabel="Email ändern">
                    <template #content>
                        <ChangeEmail @changed="emailModal?.close()" />
                    </template>
                </DisplayModal>
            </div>

            <!-- Logout -->
            <div class="flex gap-2">
                <LogoutUser />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import createReadableDate from '@/composables/dateHelper'
import { useUserStore } from '@/stores/user'

// Refs
const emailModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
