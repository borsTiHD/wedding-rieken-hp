<template>
    <Card class="card-primary">
        <template #title>
            <div class="flex gap-4">
                <h2>{{ t('profileStepper.invitationState.header') }}</h2>
                <i v-if="checkState" v-tooltip.bottom="t('profileStepper.stateComplete')" class="text-2xl pi pi-verified text-green-600" />
                <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="text-2xl pi pi-exclamation-circle text-sky-600" />
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- State incomplete -->
                <div v-if="!checkState">
                    <i18n-t v-if="isBeforeDeadline" keypath="profileStepper.invitationState.text" tag="p">
                        <template #date>
                            <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
                        </template>
                    </i18n-t>
                    <p v-else>{{ t('profileStepper.invitationState.textDeadlinePassed') }}</p>
                </div>

                <!-- State complete -->
                <p v-else>{{ t('profileStepper.invitationState.textComplete') }}</p>

                <ul class="flex flex-col divide-y">
                    <!-- Additional guests -->
                    <li v-tooltip.top="t('user.additionalGuests.tooltip')" class="profile-list-item cursor-pointer" @click="additionalGuestsModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">{{ t('user.additionalGuests.header') }}</h2>
                            <span>{{ additionalGuests }}</span>

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
                            <h2 class="text-xl font-semibold">{{ t('user.invitation.header') }}</h2>
                            <div class="flex items-center gap-2">
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
                            <h2 class="text-xl font-semibold">{{ t('user.userRole.header') }}</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ userRole }}</span>
                                <i v-if="role === 'guest'" v-tooltip.bottom="t('user.userRole.tooltipGuest')" class="pi pi-exclamation-circle text-sky-600" />
                                <i v-else-if="role === 'invited'" v-tooltip.bottom="t('user.userRole.tooltipInvited')" class="pi pi-verified text-green-600" />
                                <i v-else-if="role === 'declined'" v-tooltip.bottom="t('user.userRole.tooltipDeclined')" class="pi pi-times text-red-600" />
                            </div>
                        </div>
                    </li>
                </ul>

                <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
                <UpgradeUserRole v-if="role === 'guest' && token && token !== ''" class="basis-full" />

                <div class="flex">
                    <Button :label="t('profileStepper.buttons.back')" @click="navPage('prev')" />
                    <Button :label="t('profileStepper.buttons.complete')" class="ml-auto" @click="navPage('complete')" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import ChangeInvitation from '@/components/user/ChangeInvitation.vue'
import ChangeAdditionalGuests from '@/components/user/ChangeAdditionalGuests.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import { useModalPosition } from '@/composables/useModalPosition'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useTokenStore } from '@/stores/token'

definePageMeta({
    key: (route) => route.fullPath
})

// Emit events to parent to navigate between pages
const emit = defineEmits(['prev-page', 'complete-page'])
const navPage = (to: 'prev' | 'complete') => emit(`${to}-page`)

// Localisation
const { t, d } = useI18n()

// Modal position
const { modalPosition } = useModalPosition()

// App config
const appStore = useAppStore()
const { deadlineDate, isBeforeDeadline } = appStore

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.invitationState.header')))

// Refs
const invitationModal = ref<InstanceType<typeof DisplayModal>>()
const additionalGuestsModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const role = computed(() => userProfile.value?.role)
const additionalGuests = computed(() => userProfile.value?.additionalGuests)
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
</script>
