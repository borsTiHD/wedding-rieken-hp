<template>
    <div class="m-4 flex flex-col gap-4 p-4 border border-gray-400">
        <!-- User not logged in -->
        <div v-if="!uid" class="flex flex-col gap-4">
            <h1 class="text-2xl">Sie sind nicht eingeloggt:</h1>
            <span>Klicke <NuxtLink to="login" class="font-medium text-blue-600">hier</NuxtLink> um dich einloggen.</span>
        </div>

        <!-- User Details -->
        <div v-else class="flex flex-col gap-4">
            <h1 class="text-2xl">Benutzer Infos:</h1>
            <Avatar :image="photoURL ? photoURL : undefined" :icon="photoURL ? undefined : 'pi pi-user'" class="mr-2" size="xlarge" shape="circle" />
            <div class="flex flex-col gap-2">
                <span><b>UID:</b> {{ uid }}</span>
                <span>
                    <b>Email:</b> {{ email }}
                    <i v-if="emailVerified" v-tooltip.bottom="'Email Adresse verifiziert'" class="pi pi-verified text-green-600" />
                    <i v-else v-tooltip.bottom="'Bitte verifizieren Sie Ihre Email Adresse'" class="pi pi-exclamation-circle text-blue-600" />
                </span>
                <span><b>Name:</b> {{ displayName }}</span>
                <span><b>Telefon:</b> {{ user.phoneNumber }}</span>
                <span><b>Erstellt:</b> {{ createReadableDate(user.metadata.creationTime as string) }}</span>
                <span><b>Zuletzt eingeloggt:</b> {{ createReadableDate(user.metadata.lastSignInTime as string) }}</span>
                <pre>{{ userProfile }}</pre>
            </div>

            <!-- Upload profile picture -->
            <div class="flex gap-2">
                <UploadProfilePicture />
            </div>

            <!-- Change Email -->
            <div class="flex gap-2">
                <DisplayModal ref="emailModal" header="Email ändern" buttonLabel="Email ändern" buttonIcon="pi pi-envelope">
                    <template #content>
                        <ChangeEmail @changed="emailModal?.close()" />
                    </template>
                </DisplayModal>
            </div>

            <!-- Change Password -->
            <div class="flex gap-2">
                <DisplayModal ref="passwordModal" header="Erstelle ein neues Passwort" buttonLabel="Passwort ändern" buttonIcon="pi pi-lock">
                    <template #content>
                        <ChangePassword @changed="passwordModal?.close()" />
                    </template>
                </DisplayModal>
            </div>

            <!-- Change Display Name -->
            <div class="flex gap-2">
                <DisplayModal ref="displayNameModal" header="Ändere deinen Namen" buttonLabel="Name ändern" buttonIcon="pi pi-user">
                    <template #content>
                        <ChangeDisplayName @changed="displayNameModal?.close()" />
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
import ChangePassword from '@/components/user/ChangePassword.vue'
import ChangeDisplayName from '@/components/user/ChangeDisplayName.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import createReadableDate from '@/composables/dateHelper'
import { useUserStore } from '@/stores/user'

// Refs
const emailModal = ref<InstanceType<typeof DisplayModal>>()
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const displayNameModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

// User data from store
const uid = computed(() => userStore.uid)
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)
const photoURL = computed(() => userStore.photoURL)
const emailVerified = computed(() => userStore.emailVerified)
</script>
