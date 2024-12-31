<template>
    <Card>
        <template #title>
            <h2>{{ t('user.account.header') }}</h2>
            <p class="text-sm font-normal text-gray-500">{{ t('user.account.description') }}</p>
        </template>
        <template #content>
            <dl class="divide-y text-sm [&>*]:py-6 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
                <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
                <div v-if="userProfile.role === 'guest' && token && token !== ''" class="sm:flex">
                    <dt class="table-dt">
                        <UpgradeUserRole class="w-full" />
                    </dt>
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.upgradeUserRole') }}</span>
                    </dd>
                </div>

                <!-- Verify Email -->
                <div v-if="!emailVerified" class="sm:flex">
                    <dt class="table-dt">
                        <VerifyEmail />
                    </dt>
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.emailVerification') }}</span>
                    </dd>
                </div>

                <!-- Change Password - don't show if user logged in by email link -->
                <div v-if="!emailLinkOnly" class="sm:flex">
                    <dt class="table-dt">
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
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.password') }}</span>
                    </dd>
                </div>

                <!-- Password Reset -->
                <div class="sm:flex">
                    <dt class="table-dt">
                        <ResetPassword />
                    </dt>
                    <dd class="table-dd">
                        <span>{{ emailLinkOnly ? t('user.account.descriptions.createPassword') : t('user.account.descriptions.passwordReset') }}</span>
                    </dd>
                </div>

                <!-- Cookie Consent Settings -->
                <div class="sm:flex">
                    <dt class="table-dt">
                        <Button :label="t('consent.preferences')" severity="info" icon="pi pi-search" class="whitespace-nowrap w-full" raised @click="$CookieConsent.showPreferences()" />
                    </dt>
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.cookieConsentPreferences') }}</span>
                    </dd>
                </div>

                <!-- Cookie Consent delete -->
                <div class="sm:flex">
                    <dt class="table-dt">
                        <Button :label="t('consent.deleteme')" severity="danger" icon="pi pi-trash" class="whitespace-nowrap w-full" outlined @click="$CookieConsentActions.reset(true)" />
                    </dt>
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.cookieConsentDelete') }}</span>
                    </dd>
                </div>

                <!-- Delete User Account -->
                <div class="sm:flex">
                    <dt class="table-dt">
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
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.deleteUser') }}</span>
                    </dd>
                </div>

                <!-- Logout -->
                <div class="sm:flex">
                    <dt class="table-dt">
                        <LogoutUser />
                    </dt>
                    <dd class="table-dd">
                        <span>{{ t('user.account.descriptions.logout') }}</span>
                    </dd>
                </div>

                <!-- Back to profile settings -->
                <div class="sm:flex">
                    <Button :label="t('user.profileButton')" severity="secondary" class="w-full" icon="pi pi-user" @click="router.push(localePath('/user'))" />
                </div>
            </dl>
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
import { useModalPosition } from '@/composables/useModalPosition'
import { useUserStore } from '@/stores/user'
import { useTokenStore } from '@/stores/token'

// Composables
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { modalPosition } = useModalPosition() // Modal position
const { emailLinkOnly } = useFirebaseSignInMethods()

// Refs
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const deleteUserModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
const emailVerified = computed(() => userStore.emailVerified)

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)
</script>

<style scoped>
.table-dt {
    @apply font-medium text-gray-900 sm:w-64 sm:flex-none pb-2 sm:pb-0 sm:pr-6 content-center;
}

.table-dd {
    @apply text-gray-900 mt-2 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto;
}
</style>
