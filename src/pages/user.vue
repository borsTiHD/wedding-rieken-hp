<template>
    <div class="m-4 flex flex-col gap-4 p-4 border border-gray-400">
        <!-- User not logged in -->
        <div v-if="!user" class="flex flex-col gap-4">
            <h1 class="text-2xl">Sie sind nicht eingeloggt:</h1>
            <span>Klicke <NuxtLink to="login" class="font-medium text-blue-600">hier</NuxtLink> um dich einloggen.</span>
        </div>

        <!-- User Details -->
        <div v-else class="flex flex-col gap-4">
            <h1 class="text-2xl">Benutzer Infos:</h1>
            <Avatar :image="userAvatar ? userAvatar : undefined" :icon="userAvatar ? undefined : 'pi pi-user'" class="mr-2" size="xlarge" shape="circle" />
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
            </div>

            <!-- Upload profile picture -->
            <UploadProfilePicture @uploaded="onAvatarChange" />

            <LogoutUser />
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoutUser from '@/components/user/LogoutUser.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import createReadableDate from '@/composables/dateHelper'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
const userAvatar = ref<false | string>(user.value?.photoURL || false)

// On avatar change - update userAvatar
const onAvatarChange = () => {
    userAvatar.value = user.value?.photoURL || false
}

console.log(user.value)
console.log(userProfile.value)
</script>
