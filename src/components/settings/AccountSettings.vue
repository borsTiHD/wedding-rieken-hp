<template>
    <Card class="card-primary">
        <template #title>
            <h2>{{ t('user.account.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <p class="mt-1 text-sm leading-6 text-gray-500">{{ t('user.account.description') }}</p>

                <dl class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
                    <div v-if="userProfile.role === 'guest' && token && token !== ''" class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            <UpgradeUserRole class="w-full" />
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ t('user.account.descriptions.upgradeUserRole') }}</div>
                        </dd>
                    </div>

                    <!-- Verify Email -->
                    <div v-if="!emailVerified" class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            <VerifyEmail />
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ t('user.account.descriptions.passwordReset') }}</div>
                        </dd>
                    </div>

                    <!-- Change Password -->
                    <div class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            <DisplayModal
                                ref="passwordModal"
                                :position="modalPosition"
                                :header="t('user.password.changePassword.modalHeader')"
                                :buttonLabel="t('user.password.changePassword.modalButton')"
                                buttonIcon="pi pi-lock"
                                buttonClass="whitespace-nowrap w-full"
                                buttonRaised
                                button
                            >
                                <template #content>
                                    <ChangePassword @changed="passwordModal?.close()" />
                                </template>
                            </DisplayModal>
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ t('user.account.descriptions.password') }}</div>
                        </dd>
                    </div>

                    <!-- Password Reset -->
                    <div class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            <ResetPassword />
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ t('user.account.descriptions.passwordReset') }}</div>
                        </dd>
                    </div>

                    <!-- Delete User Account -->
                    <div class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            <DisplayModal
                                ref="deleteUserModal"
                                :position="modalPosition"
                                :header="t('user.deleteUser.headerModal')"
                                :buttonLabel="t('user.deleteUser.submit')"
                                buttonIcon="pi pi-user-minus"
                                buttonClass="whitespace-nowrap w-full"
                                buttonSeverity="danger"
                                buttonOutlined
                                button
                            >
                                <template #content>
                                    <DeleteUser @deleted="deleteUserModal?.close()" />
                                </template>
                            </DisplayModal>
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ t('user.account.descriptions.deleteUser') }}</div>
                        </dd>
                    </div>

                    <!-- Logout -->
                    <div class="pt-6 sm:flex">
                        <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            <LogoutUser />
                        </dt>
                        <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div class="text-gray-900">{{ t('user.account.descriptions.logout') }}</div>
                        </dd>
                    </div>
                </dl>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import VerifyEmail from '@/components/user/VerifyEmail.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import ResetPassword from '@/components/user/ResetPassword.vue'
import DeleteUser from '@/components/user/DeleteUser.vue'
import useInvitationToken from '@/composables/useInvitationToken'
import { useModalPosition } from '@/composables/useModalPosition'
import { useUserStore } from '@/stores/user'

// Composables
const { t } = useI18n()
const { modalPosition } = useModalPosition() // Modal position

// Refs
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const deleteUserModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const emailVerified = computed(() => userStore.emailVerified)

// Invitation token
const { getInvitationToken } = useInvitationToken()
const token = computed(() => getInvitationToken())
</script>
