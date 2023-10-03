<template>
    <!-- User not logged in -->
    <div v-if="!uid" class="flex flex-col gap-4">
        <h1 class="text-2xl">Sie sind nicht eingeloggt:</h1>
        <span>Klicke <NuxtLink to="login" class="font-medium text-blue-600">hier</NuxtLink> um dich einloggen.</span>
    </div>

    <!-- User Details -->
    <div v-else class="bg-gray-100 py-4 flex flex-col gap-4">
        <div class="w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto flex flex-col gap-4">
            <!-- User profile picture -->
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
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
                            @mouseleave="showProfilePictureEditIcon = false"
                            @click="profilePictureModal?.open()"
                        >
                            <Button icon="pi pi-pencil" rounded aria-label="Profilbild editieren" @click="profilePictureModal?.open()" />
                        </div>

                        <!-- Profile picture edit modal -->
                        <DisplayModal ref="profilePictureModal" header="Profilbild ändern">
                            <template #content>
                                <UploadProfilePicture @uploaded="profilePictureModal?.close()" />
                            </template>
                        </DisplayModal>
                    </div>
                    <div class="flex flex-col">
                        <!-- Display name -->
                        <h1 class="text-2xl font-semibold">{{ displayName ? $t('welcome', { name: displayName }) : $t('noName') }}</h1>

                        <!-- Email Address -->
                        <div class="flex items-center gap-2">
                            <p class="text-gray-600">{{ email }}</p>
                            <i v-if="emailVerified" v-tooltip.bottom="'Email Adresse verifiziert'" class="pi pi-verified text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- User information -->
            <div class="bg-white p-4 shadow-md rounded-lg">
                <h2 class="text-2xl font-semibold mb-6">Benutzerinformationen</h2>
                <ul class="flex flex-col gap-2">
                    <!-- Display name -->
                    <li v-tooltip.top="'Ändere deinen Namen'" class="flex items-center justify-between border-b-2 mb-2 pb-2 cursor-pointer" @click="displayNameModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">Name</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ userStore.displayName }}</span>
                                <i v-if="!userStore.displayName" v-tooltip.bottom="'Sie haben keinen Namen angegeben. Bitte tragen Sie Ihren Namen ein.'" class="pi pi-question-circle text-yellow-300" />
                            </div>

                            <!-- Display name change modal -->
                            <DisplayModal ref="displayNameModal" header="Ändere deinen Namen">
                                <template #content>
                                    <ChangeDisplayName @changed="displayNameModal?.close()" />
                                </template>
                            </DisplayModal>
                        </div>
                        <i class="pi pi-chevron-right" />
                    </li>

                    <!-- Email -->
                    <li v-tooltip.top="'Ändere deine Email Adresse'" class="flex items-center justify-between border-b-2 mb-2 pb-2 cursor-pointer" @click="emailModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">E-Mail</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ email }}</span>
                                <i v-if="emailVerified" v-tooltip.bottom="'Email Adresse verifiziert'" class="pi pi-verified text-green-600" />

                                <!-- Email verification button -->
                                <Button
                                    v-else
                                    v-tooltip.bottom="'Bitte verifizieren Sie Ihre Email Adresse'"
                                    aria-label="Email verifizieren"
                                    icon="pi pi-exclamation-circle"
                                    outlined
                                    class="p-0"
                                    :loading="loadingEmailVerify"
                                    @click.prevent="handleVerifyEmail"
                                />
                            </div>

                            <!-- Email change modal -->
                            <DisplayModal ref="emailModal" header="Email ändern">
                                <template #content>
                                    <ChangeEmail @changed="emailModal?.close()" />
                                </template>
                            </DisplayModal>
                        </div>
                        <i class="pi pi-chevron-right" />
                    </li>

                    <!-- Phone -->
                    <li v-tooltip.top="'Ändere deine Telefonnummer'" class="flex items-center justify-between border-b-2 mb-2 pb-2 cursor-pointer" @click="emailModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">Telefonnummer</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ userProfile.phoneNumber }}</span>
                                <i v-if="!userProfile.phoneNumber" v-tooltip.bottom="'Bitte tragen Sie Ihre Handynummer ein, falls Sie über Änderungen frühstmöglich informiert werden möchten.'" class="pi pi-question-circle text-yellow-300" />
                            </div>
                        </div>
                        <i class="pi pi-chevron-right" />
                    </li>

                    <!-- Additional guests -->
                    <li v-tooltip.top="'Mit wie vielen zusätzlichen Gästen möchten Sie erscheinen?'" class="flex items-center justify-between border-b-2 mb-2 pb-2 cursor-pointer" @click="emailModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">Zusätzliche Gäste</h2>
                            <span>{{ userProfile.additionalGuests }}</span>
                        </div>
                        <i class="pi pi-chevron-right" />
                    </li>

                    <!-- Invitation status -->
                    <li v-tooltip.top="'Hier können Sie die Einladung an- oder ablehnen.'" class="flex items-center justify-between border-b-2 mb-2 pb-2 cursor-pointer" @click="emailModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">Einladungsstatus</h2>
                            <span>{{ invitationStatus }}</span>
                        </div>
                        <i class="pi pi-chevron-right" />
                    </li>

                    <!-- User role -->
                    <li class="flex items-center justify-between border-b-2 mb-2 pb-2">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">Rolle</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ userRole }}</span>
                                <i v-if="userProfile.role === 'guest'" v-tooltip.bottom="'Sie haben sich selbst registriert. Bitte warten Sie noch auf eine Bestätigung Ihrer Einladung.'" class="pi pi-exclamation-circle text-sky-600" />
                                <i v-else-if="userProfile.role === 'invited'" v-tooltip.bottom="'Sie haben eine verifizierte Einladung'" class="pi pi-verified text-green-600" />
                            </div>
                        </div>
                    </li>

                    <!-- User actions -->
                    <li class="flex flex-col gap-4 mt-12">
                        <FormKit
                            v-model="locale"
                            type="select"
                            :label="$t('language')"
                            name="language"
                            :options="availableLocales"
                            @change="onLanguageChange"
                        />

                        <!-- Change Password -->
                        <DisplayModal ref="passwordModal" header="Erstelle ein neues Passwort" button buttonLabel="Passwort ändern" buttonIcon="pi pi-lock">
                            <template #content>
                                <ChangePassword @changed="passwordModal?.close()" />
                            </template>
                        </DisplayModal>

                        <!-- Password Reset -->
                        <ResetPassword />

                        <!-- Delete User Account -->
                        <DisplayModal ref="deleteUserModal" header="Account löschen?" button buttonLabel="Account löschen" buttonIcon="pi pi-user" buttonSeverity="danger" buttonOutlined>
                            <template #content>
                                <DeleteUser @deleted="deleteUserModal?.close()" />
                            </template>
                        </DisplayModal>

                        <!-- Logout -->
                        <LogoutUser />

                        <!-- PROFILE TEST -->
                        <Button label="TESTE PROFILE DATA" severity="success" icon="pi pi-lock" @click="testProfile" />
                    </li>
                </ul>
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
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()
const { sendUserEmailVerification } = useFirebaseAuth()
const { changeAdditionalUserProfileData } = useFirebaseUserProfile()

// Language options
const { locale, locales, setLocale, setLocaleCookie } = useI18n()
const availableLocales = computed(() => {
    return locales.value.map((locale) => {
        return {
            value: typeof locale === 'string' ? locale : locale.code,
            label: typeof locale === 'string' ? locale : locale.name
        } as { value: string; label: string }
    })
})
const onLanguageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const selectedLocale = target.value
    setLocaleCookie(selectedLocale)
    setLocale(selectedLocale)
}

// Refs
const profilePictureModal = ref<InstanceType<typeof DisplayModal>>()
const emailModal = ref<InstanceType<typeof DisplayModal>>()
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const displayNameModal = ref<InstanceType<typeof DisplayModal>>()
const deleteUserModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)

// User data from store
const uid = computed(() => userStore.uid)
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)
const photoURL = computed(() => userStore.photoURL)
const emailVerified = computed(() => userStore.emailVerified)
const invitationStatus = computed(() => {
    const invitation = userProfile.value?.invitation
    if (invitation === 'pending') return 'Einladung ausstehend'
    if (invitation === 'accepted') return 'Einladung angenommen'
    if (invitation === 'declined') return 'Einladung abgelehnt'
    return 'Keine Einladung'
})
const userRole = computed(() => {
    const role = userProfile.value?.role
    if (role === 'admin') return 'Administrator'
    if (role === 'invited') return 'Eingeladener Gast'
    if (role === 'guest') return 'Selbsregistrierter Gast'
    return 'Keine Rolle'
})

// Refs
const showProfilePictureEditIcon = ref(false)

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

const testProfile = async() => {
    const response = await changeAdditionalUserProfileData({
        additionalGuests: 0,
        invitation: 'pending',
        phoneNumber: '+49123456789'
    }).catch((error: Error) => {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Fehler beim Ändern der Daten',
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Show success toast
    if (response) {
        toast.add({ severity: 'success', summary: 'Daten geändert', detail: 'Ihre Daten wurden angepasst', life: 3000 })
    }
}
</script>
