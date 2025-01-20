<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import ChangeAdditionalGuests from '@/components/user/ChangeAdditionalGuests.vue'
import ChangeDisplayName from '@/components/user/ChangeDisplayName.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import ChangeInvitation from '@/components/user/ChangeInvitation.vue'
import ChangePhone from '@/components/user/ChangePhone.vue'
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import UploadProfilePicture from '@/components/user/UploadProfilePicture.vue'
import VerifyEmail from '@/components/user/VerifyEmail.vue'
import { useModalPosition } from '@/composables/useModalPosition'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'

// Composables
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()
const { modalPosition } = useModalPosition() // Modal position

// TODO: Create a hover effect for the list items
// TODO: Create a step by step guide for the user profile, with a progress bar at the top and a button to skip the guide
//       The guide should be shown on the first login and when the user clicks on the button to show the guide
//       Make sure to save the state of the guide in the user profile
//       Should the guide show the invitation queston first? Also with a nice response to the answer?
// TODO: More mobile friendly - the tooltips for more information whats wrong is not displaying (mabye show it in an grayish text below the display fields?)

// Refs
const emailModal = ref<InstanceType<typeof DisplayModal>>()
const phoneModal = ref<InstanceType<typeof DisplayModal>>()
const invitationModal = ref<InstanceType<typeof DisplayModal>>()
const displayNameModal = ref<InstanceType<typeof DisplayModal>>()
const additionalGuestsModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)

// User data from store
const email = computed(() => userStore.email)
const emailVerified = computed(() => userStore.emailVerified)
const invitationStatus = computed(() => {
  const invitation = userProfile.value?.invitation
  if (invitation === 'pending')
    return t('user.invitation.stateNoReponse')
  if (invitation === 'accepted')
    return t('user.invitation.stateAccepted')
  if (invitation === 'declined')
    return t('user.invitation.stateDeclined')
  return t('user.invitation.stateNoInvitation')
})
const userRole = computed(() => {
  const role = userProfile.value?.role
  if (role === 'admin')
    return t('user.userRole.adminRole')
  if (role === 'invited')
    return t('user.userRole.invitedRole')
  if (role === 'guest')
    return t('user.userRole.guestRole')
  if (role === 'declined')
    return t('user.userRole.declinedRole')
  return t('user.userRole.noRole')
})

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)
</script>

<template>
  <Card>
    <template #title>
      <h2>{{ t('user.header') }}</h2>
      <p class="text-sm font-normal text-gray-500">
        {{ t('user.description') }}
      </p>
    </template>
    <template #content>
      <div class="flex flex-col divide-y">
        <div class="col-span-full flex items-center gap-x-8 pb-4">
          <DisplayAvatar size="xl" preview />
          <UploadProfilePicture />
        </div>

        <ul class="flex flex-col divide-y">
          <!-- Display name -->
          <li v-tooltip.top="t('user.displayName.tooltip')" class="profile-list-item cursor-pointer" @click="displayNameModal?.open()">
            <div class="flex flex-col">
              <h2 class="text-xl font-semibold">
                {{ t('user.displayName.header') }}
              </h2>
              <div class="font-light sm:font-normal flex items-center gap-2">
                <span>{{ userStore.displayName }}</span>
                <i v-if="!userStore.displayName" v-tooltip.right="t('user.displayName.tooltipNoName')" class="pi pi-question-circle text-yellow-300" />
              </div>

              <!-- Display name change modal -->
              <DisplayModal ref="displayNameModal" :position="modalPosition" :header="t('user.displayName.headerModal')">
                <template #content>
                  <ChangeDisplayName @changed="displayNameModal?.close()" />
                </template>
              </DisplayModal>
            </div>
            <i class="pi pi-chevron-right" />
          </li>

          <!-- Email -->
          <li v-tooltip.top="t('user.email.tooltip')" class="profile-list-item cursor-pointer" @click="emailModal?.open()">
            <div class="flex flex-col">
              <h2 class="text-xl font-semibold">
                {{ t('user.email.header') }}
              </h2>
              <div class="font-light sm:font-normal flex items-center gap-2">
                <span>{{ email }}</span>
                <i v-if="emailVerified" v-tooltip.bottom="t('user.email.verified')" class="pi pi-verified text-green-600" />

                <!-- Email verification button -->
                <VerifyEmail v-if="!emailVerified" mode="small" />
              </div>

              <!-- Email change modal -->
              <DisplayModal ref="emailModal" :position="modalPosition" :header="t('user.email.headerModal')">
                <template #content>
                  <ChangeEmail @changed="emailModal?.close()" />
                </template>
              </DisplayModal>
            </div>
            <i class="pi pi-chevron-right" />
          </li>

          <!-- Phone -->
          <li v-tooltip.top="t('user.phone.tootlip')" class="profile-list-item cursor-pointer" @click="phoneModal?.open()">
            <div class="flex flex-col">
              <h2 class="text-xl font-semibold">
                {{ t('user.phone.header') }}
              </h2>
              <div class="font-light sm:font-normal flex items-center gap-2">
                <span>{{ userProfile.phoneNumber }}</span>
                <i v-if="!userProfile.phoneNumber" v-tooltip.right="t('user.phone.tooltipMissingPhone')" class="pi pi-question-circle text-yellow-300" />
              </div>

              <!-- Phone change modal -->
              <DisplayModal ref="phoneModal" :position="modalPosition" :header="t('user.phone.headerModal')">
                <template #content>
                  <ChangePhone @changed="phoneModal?.close()" />
                </template>
              </DisplayModal>
            </div>
            <i class="pi pi-chevron-right" />
          </li>

          <!-- Additional guests -->
          <li v-tooltip.top="t('user.additionalGuests.tooltip')" class="profile-list-item cursor-pointer" @click="additionalGuestsModal?.open()">
            <div class="flex flex-col">
              <h2 class="text-xl font-semibold">
                {{ t('user.additionalGuests.header') }}
              </h2>
              <span class="font-light sm:font-normal">{{ userProfile.additionalGuests }}</span>

              <!-- Additional Guests change modal -->
              <DisplayModal ref="additionalGuestsModal" :position="modalPosition" :header="t('user.additionalGuests.headerModal')">
                <template #content>
                  <ChangeAdditionalGuests @changed="additionalGuestsModal?.close()" />
                </template>
              </DisplayModal>
            </div>
            <i class="pi pi-chevron-right" />
          </li>

          <!-- Invitation status -->
          <li v-tooltip.top="t('user.invitation.tooltip')" class="profile-list-item cursor-pointer" @click="invitationModal?.open()">
            <div class="flex flex-col">
              <h2 class="text-xl font-semibold">
                {{ t('user.invitation.header') }}
              </h2>
              <div class="font-light sm:font-normal flex items-center gap-2">
                <span>{{ invitationStatus }}</span>
                <i v-if="userProfile?.invitation === 'accepted'" v-tooltip.bottom="t('user.invitation.tooltipAccepted')" class="pi pi-verified text-green-600" />
                <i v-else-if="userProfile?.invitation === 'declined'" v-tooltip.bottom="t('user.invitation.tooltipDeclined')" class="pi pi-times-circle text-red-600" />
                <i v-else-if="userProfile?.invitation === 'pending'" v-tooltip.bottom="t('user.invitation.tooltipNoResponse')" class="pi pi-question-circle text-yellow-300" />
              </div>

              <!-- Additional Guests change modal -->
              <DisplayModal ref="invitationModal" :position="modalPosition" :header="t('user.invitation.headerModal')">
                <template #content>
                  <ChangeInvitation @changed="invitationModal?.close()" />
                </template>
              </DisplayModal>
            </div>
            <i class="pi pi-chevron-right" />
          </li>

          <!-- User role -->
          <li class="profile-list-item">
            <div class="flex flex-col">
              <h2 class="text-xl font-semibold">
                {{ t('user.userRole.header') }}
              </h2>
              <div class="font-light sm:font-normal flex items-center gap-2">
                <span>{{ userRole }}</span>
                <i v-if="userProfile.role === 'guest'" v-tooltip.bottom="t('user.userRole.tooltipGuest')" class="pi pi-exclamation-circle text-sky-600" />
                <i v-else-if="userProfile.role === 'invited'" v-tooltip.bottom="t('user.userRole.tooltipInvited')" class="pi pi-verified text-green-600" />
                <i v-else-if="userProfile.role === 'declined'" v-tooltip.bottom="t('user.userRole.tooltipDeclined')" class="pi pi-times text-red-600" />
              </div>
            </div>
          </li>

          <!-- User actions -->
          <li v-if="userProfile.role === 'guest' && token && token !== ''" class="profile-list-item">
            <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
            <UpgradeUserRole class="basis-full" />
          </li>

          <!-- Go to account settings -->
          <li class="profile-list-item pt-4">
            <Button :label="t('user.account.button')" severity="secondary" class="w-full" icon="pi pi-user" @click="router.push(localePath('/user/account'))" />
          </li>
        </ul>
      </div>
    </template>
  </Card>
</template>
