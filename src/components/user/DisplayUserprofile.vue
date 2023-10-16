<template>
    <Card>
        <template #title>{{ t('user.header') }}</template>
        <template #content>
            <ul class="flex flex-col gap-2">
                <!-- Display name -->
                <li v-tooltip.top="t('user.displayName.tooltip')" class="list-item cursor-pointer" @click="displayNameModal?.open()">
                    <div class="flex flex-col">
                        <h2 class="text-xl font-semibold">{{ t('user.displayName.header') }}</h2>
                        <div class="flex items-center gap-2">
                            <span>{{ userStore.displayName }}</span>
                            <i v-if="!userStore.displayName" v-tooltip.right="t('user.displayName.tooltipNoName')" class="pi pi-question-circle text-yellow-300" />
                        </div>

                        <!-- Display name change modal -->
                        <DisplayModal ref="displayNameModal" :header="t('user.displayName.headerModal')">
                            <template #content>
                                <ChangeDisplayName @changed="displayNameModal?.close()" />
                            </template>
                        </DisplayModal>
                    </div>
                    <i class="pi pi-chevron-right" />
                </li>

                <!-- Email -->
                <li v-tooltip.top="t('user.email.tooltip')" class="list-item cursor-pointer" @click="emailModal?.open()">
                    <div class="flex flex-col">
                        <h2 class="text-xl font-semibold">{{ t('user.email.header') }}</h2>
                        <div class="flex items-center gap-2">
                            <span>{{ email }}</span>
                            <i v-if="emailVerified" v-tooltip.bottom="t('user.email.verified')" class="pi pi-verified text-green-600" />

                            <!-- Email verification button -->
                            <Button
                                v-else
                                v-tooltip.bottom="t('user.email.tooltipPlzVerifie')"
                                :aria-label="t('user.email.verifieAriaLabel')"
                                icon="pi pi-exclamation-circle"
                                outlined
                                class="p-0"
                                :loading="loadingEmailVerify"
                                @click.prevent="handleVerifyEmail"
                            />
                        </div>

                        <!-- Email change modal -->
                        <DisplayModal ref="emailModal" :header="t('user.email.headerModal')">
                            <template #content>
                                <ChangeEmail @changed="emailModal?.close()" />
                            </template>
                        </DisplayModal>
                    </div>
                    <i class="pi pi-chevron-right" />
                </li>

                <!-- Phone -->
                <li v-tooltip.top="t('user.phone.tootlip')" class="list-item cursor-pointer" @click="phoneModal?.open()">
                    <div class="flex flex-col">
                        <h2 class="text-xl font-semibold">{{ t('user.phone.header') }}</h2>
                        <div class="flex items-center gap-2">
                            <span>{{ userProfile.phoneNumber }}</span>
                            <i v-if="!userProfile.phoneNumber" v-tooltip.right="t('user.phone.tooltipMissingPhone')" class="pi pi-question-circle text-yellow-300" />
                        </div>

                        <!-- Phone change modal -->
                        <DisplayModal ref="phoneModal" :header="t('user.phone.headerModal')">
                            <template #content>
                                <ChangePhone @changed="phoneModal?.close()" />
                            </template>
                        </DisplayModal>
                    </div>
                    <i class="pi pi-chevron-right" />
                </li>

                <!-- Additional guests -->
                <li v-tooltip.top="t('user.additionalGuests.tooltip')" class="list-item cursor-pointer" @click="additionalGuestsModal?.open()">
                    <div class="flex flex-col">
                        <h2 class="text-xl font-semibold">{{ t('user.additionalGuests.header') }}</h2>
                        <span>{{ userProfile.additionalGuests }}</span>

                        <!-- Additional Guests change modal -->
                        <DisplayModal ref="additionalGuestsModal" :header="t('user.additionalGuests.headerModal')">
                            <template #content>
                                <ChangeAdditionalGuests @changed="additionalGuestsModal?.close()" />
                            </template>
                        </DisplayModal>
                    </div>
                    <i class="pi pi-chevron-right" />
                </li>

                <!-- Invitation status -->
                <li v-tooltip.top="t('user.invitation.tooltip')" class="list-item cursor-pointer" @click="invitationModal?.open()">
                    <div class="flex flex-col">
                        <h2 class="text-xl font-semibold">{{ t('user.invitation.header') }}</h2>
                        <div class="flex items-center gap-2">
                            <span>{{ invitationStatus }}</span>
                            <i v-if="userProfile?.invitation === 'accepted'" v-tooltip.bottom="t('user.invitation.tooltipAccepted')" class="pi pi-verified text-green-600" />
                            <i v-else-if="userProfile?.invitation === 'declined'" v-tooltip.bottom="t('user.invitation.tooltipDeclined')" class="pi pi-exclamation-circle text-sky-600" />
                            <i v-else-if="userProfile?.invitation === 'pending'" v-tooltip.bottom="t('user.invitation.tooltipNoResponse')" class="pi pi-question-circle text-yellow-300" />
                        </div>

                        <!-- Additional Guests change modal -->
                        <DisplayModal ref="invitationModal" :header="t('user.invitation.headerModal')">
                            <template #content>
                                <ChangeInvitation @changed="invitationModal?.close()" />
                            </template>
                        </DisplayModal>
                    </div>
                    <i class="pi pi-chevron-right" />
                </li>

                <!-- User role -->
                <li class="list-item">
                    <div class="flex flex-col">
                        <h2 class="text-xl font-semibold">{{ t('user.userRole.header') }}</h2>
                        <div class="flex items-center gap-2">
                            <span>{{ userRole }}</span>
                            <i v-if="userProfile.role === 'guest'" v-tooltip.bottom="t('user.userRole.tooltipGuest')" class="pi pi-exclamation-circle text-sky-600" />
                            <i v-else-if="userProfile.role === 'invited'" v-tooltip.bottom="t('user.userRole.tooltipInvited')" class="pi pi-verified text-green-600" />
                            <i v-else-if="userProfile.role === 'declined'" v-tooltip.bottom="t('user.userRole.tooltipDeclined')" class="pi pi-times text-red-600" />
                        </div>
                    </div>
                </li>

                <!-- User actions -->
                <li class="flex flex-col gap-4 mt-12">
                    <!-- Change Language -->
                    <div class="mb-8">
                        <ChangeLanguage />
                    </div>

                    <div class="flex gap-2 w-full">
                        <!-- Change Password -->
                        <DisplayModal
                            ref="passwordModal"
                            buttonClass="basis-1/2"
                            :header="t('user.password.changePassword.modalHeader')"
                            :buttonLabel="t('user.password.changePassword.modalButton')"
                            buttonIcon="pi pi-lock"
                            buttonRaised
                            button
                        >
                            <template #content>
                                <ChangePassword @changed="passwordModal?.close()" />
                            </template>
                        </DisplayModal>

                        <!-- Password Reset -->
                        <ResetPassword class="basis-1/2" />
                    </div>

                    <div class="flex gap-2 w-full">
                        <!-- Delete User Account -->
                        <DisplayModal
                            ref="deleteUserModal"
                            buttonClass="basis-1/2"
                            :header="t('user.deleteUser.headerModal')"
                            :buttonLabel="t('user.deleteUser.submit')"
                            buttonIcon="pi pi-user-minus"
                            buttonSeverity="danger"
                            buttonOutlined
                            button
                        >
                            <template #content>
                                <DeleteUser @deleted="deleteUserModal?.close()" />
                            </template>
                        </DisplayModal>

                        <!-- Logout -->
                        <LogoutUser class="basis-1/2" />
                    </div>
                </li>
            </ul>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import ChangePhone from '@/components/user/ChangePhone.vue'
import ChangeAdditionalGuests from '@/components/user/ChangeAdditionalGuests.vue'
import ChangeInvitation from '@/components/user/ChangeInvitation.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import ChangeDisplayName from '@/components/user/ChangeDisplayName.vue'
import ResetPassword from '@/components/user/ResetPassword.vue'
import DeleteUser from '@/components/user/DeleteUser.vue'
import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()
const { t } = useI18n()
const { sendUserEmailVerification } = useFirebaseAuth()

// TODO: Create a hover effect for the list items
// TODO: Create a step by step guide for the user profile, with a progress bar at the top and a button to skip the guide
//       The guide should be shown on the first login and when the user clicks on the button to show the guide
//       Make sure to save the state of the guide in the user profile
//       Should the guide show the invitation queston first? Also with a nice response to the answer?

// Refs
const emailModal = ref<InstanceType<typeof DisplayModal>>()
const phoneModal = ref<InstanceType<typeof DisplayModal>>()
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const invitationModal = ref<InstanceType<typeof DisplayModal>>()
const displayNameModal = ref<InstanceType<typeof DisplayModal>>()
const additionalGuestsModal = ref<InstanceType<typeof DisplayModal>>()
const deleteUserModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)

// User data from store
const email = computed(() => userStore.email)
const emailVerified = computed(() => userStore.emailVerified)
const invitationStatus = computed(() => {
    const invitation = userProfile.value?.invitation
    if (invitation === 'pending') return t('user.invitation.stateNoReponse')
    if (invitation === 'accepted') return t('user.invitation.stateAccepted')
    if (invitation === 'declined') return t('user.invitation.stateDeclined')
    return t('user.invitation.stateNoInvitation')
})
const userRole = computed(() => {
    const role = userProfile.value?.role
    if (role === 'admin') return t('user.userRole.adminRole')
    if (role === 'invited') return t('user.userRole.invitedRole')
    if (role === 'guest') return t('user.userRole.guestRole')
    if (role === 'declined') return t('user.userRole.declinedRole')
    return t('user.userRole.noRole')
})

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
            summary: t('user.email.verifiedError'),
            detail: error.message,
            life: 10000
        })
        return false
    })

    // Show success toast
    if (response) {
        toast.add({
            severity: 'success',
            summary: t('user.email.verifiedSuccess'),
            detail: t('user.email.verifiedSuccessDetail'),
            life: 10000
        })
    }

    // Stop loading
    loadingEmailVerify.value = false
}
</script>

<style scoped>
.list-item {
    @apply flex items-center justify-between border-b-2 mb-2 pb-2 !important;
}
</style>
