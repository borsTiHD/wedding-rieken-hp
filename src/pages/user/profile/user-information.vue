<template>
    <Card>
        <template #title>
            <div class="flex gap-4">
                <h2>{{ t('profileStepper.userInformation.header') }}</h2>
                <i v-if="checkState" v-tooltip.bottom="t('profileStepper.stateComplete')" class="text-2xl pi pi-verified text-green-600" />
                <i v-else v-tooltip.bottom="t('profileStepper.stateIncomplete')" class="text-2xl pi pi-exclamation-circle text-sky-600" />
            </div>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- State incomplete -->
                <div v-if="!checkState" class="flex gap-4">
                    <p>{{ t('profileStepper.userInformation.text') }}</p>
                </div>
                <!-- State complete -->
                <div v-else class="flex gap-4">
                    <p>{{ t('profileStepper.userInformation.textComplete') }}</p>
                </div>

                <ul class="flex flex-col divide-y">
                    <!-- Display name -->
                    <li v-tooltip.top="t('user.displayName.tooltip')" class="profile-list-item cursor-pointer" @click="displayNameModal?.open()">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-semibold">{{ t('user.displayName.header') }}</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ displayName }}</span>
                                <i v-if="!displayName" v-tooltip.right="t('user.displayName.tooltipNoName')" class="pi pi-question-circle text-yellow-300" />
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
                            <h2 class="text-xl font-semibold">{{ t('user.phone.header') }}</h2>
                            <div class="flex items-center gap-2">
                                <span>{{ phoneNumber }}</span>
                                <i v-if="!phoneNumber" v-tooltip.right="t('user.phone.tooltipMissingPhone')" class="pi pi-question-circle text-yellow-300" />
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
                </ul>

                <div class="flex">
                    <Button :label="t('profileStepper.buttons.back')" @click="navPage('prev')" />
                    <Button :label="t('profileStepper.buttons.next')" class="ml-auto" @click="navPage('next')" />
                </div>
            </div>

            <!-- Display name change modal -->
            <DisplayModal ref="displayNameModal" :position="modalPosition" :header="t('user.displayName.headerModal')">
                <template #content>
                    <ChangeDisplayName @changed="displayNameModal?.close()" />
                </template>
            </DisplayModal>

            <!-- Email change modal -->
            <DisplayModal ref="emailModal" :position="modalPosition" :header="t('user.email.headerModal')">
                <template #content>
                    <ChangeEmail @changed="emailModal?.close()" />
                </template>
            </DisplayModal>

            <!-- Phone change modal -->
            <DisplayModal ref="phoneModal" :position="modalPosition" :header="t('user.phone.headerModal')">
                <template #content>
                    <ChangePhone @changed="phoneModal?.close()" />
                </template>
            </DisplayModal>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DisplayModal from '@/components/DisplayModal.vue'
import ChangeDisplayName from '@/components/user/ChangeDisplayName.vue'
import ChangeEmail from '@/components/user/ChangeEmail.vue'
import ChangePhone from '@/components/user/ChangePhone.vue'
import { useModalPosition } from '@/composables/useModalPosition'
import { useUserStore } from '@/stores/user'

definePageMeta({
    key: (route) => route.fullPath
})

// Emit events to parent to navigate between pages
const emit = defineEmits(['next-page', 'prev-page'])
const navPage = (to: 'next' | 'prev') => emit(`${to}-page`)

// Composables
const toast = useToast()
const { t } = useI18n() // Localisation
const { sendUserEmailVerification } = useFirebaseAuth()
const { modalPosition } = useModalPosition() // Modal position

// Refs
const displayNameModal = ref<InstanceType<typeof DisplayModal>>()
const emailModal = ref<InstanceType<typeof DisplayModal>>()
const phoneModal = ref<InstanceType<typeof DisplayModal>>()

// Check completion state of this page
const { checker } = useProfileChecker()
const checkState = computed(() => checker(t('profileStepper.userInformation.header')))

// User store
const userStore = useUserStore()
const displayName = computed(() => userStore.displayName)
const email = computed(() => userStore.email)
const emailVerified = computed(() => userStore.emailVerified)
const userProfile = computed(() => userStore.userProfile)
const phoneNumber = computed(() => userProfile.value?.phoneNumber)

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
