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
                    <Button
                        v-else
                        v-tooltip.bottom="'Bitte verifizieren Sie Ihre Email Adresse'"
                        aria-label="Email verifizieren"
                        icon="pi pi-exclamation-circle"
                        outlined
                        class="p-0"
                        :loading="loadingEmailVerify"
                        @click="handleVerifyEmail"
                    />
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
                <DisplayModal ref="emailModal" header="Email ändern" button buttonLabel="Email ändern" buttonIcon="pi pi-envelope">
                    <template #content>
                        <ChangeEmail @changed="emailModal?.close()" />
                    </template>
                </DisplayModal>
            </div>

            <!-- Change Password -->
            <div class="flex gap-2">
                <DisplayModal ref="passwordModal" header="Erstelle ein neues Passwort" button buttonLabel="Passwort ändern" buttonIcon="pi pi-lock">
                    <template #content>
                        <ChangePassword @changed="passwordModal?.close()" />
                    </template>
                </DisplayModal>
            </div>

            <!-- Password Reset -->
            <div class="flex gap-2">
                <ResetPassword />
            </div>

            <!-- Change Display Name -->
            <div class="flex gap-2">
                <DisplayModal ref="displayNameModal" header="Ändere deinen Namen" button buttonLabel="Name ändern" buttonIcon="pi pi-user">
                    <template #content>
                        <ChangeDisplayName @changed="displayNameModal?.close()" />
                    </template>
                </DisplayModal>
            </div>

            <!-- Delete User Account -->
            <div class="flex gap-2">
                <DisplayModal ref="deleteUserModal" header="Account löschen?" button buttonLabel="Account löschen" buttonIcon="pi pi-user" buttonSeverity="danger" buttonOutlined>
                    <template #content>
                        <DeleteUser @deleted="deleteUserModal?.close()" />
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
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import ChangeDisplayName from '@/components/user/ChangeDisplayName.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import ResetPassword from '@/components/user/ResetPassword.vue'
import DeleteUser from '@/components/user/DeleteUser.vue'
import createReadableDate from '@/composables/dateHelper'
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()
const { sendUserEmailVerification } = useFirebaseAuth()

// Refs
const emailModal = ref<InstanceType<typeof DisplayModal>>()
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const displayNameModal = ref<InstanceType<typeof DisplayModal>>()
const deleteUserModal = ref<InstanceType<typeof DisplayModal>>()

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

// Email verification
const loadingEmailVerify = ref(false)
const handleVerifyEmail = async() => {
    // Start loading
    loadingEmailVerify.value = true

    // Send email verification
    const response = await sendUserEmailVerification().catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Senden der Email',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Show success toast
    if (response) {
        toast.add({ severity: 'success', summary: 'Email gesendet', detail: 'Sie haben eine Email zur Verifizierung Ihrer Email Adresse erhalten.', life: 3000 })
    }

    // Stop loading
    loadingEmailVerify.value = false
}
</script>
