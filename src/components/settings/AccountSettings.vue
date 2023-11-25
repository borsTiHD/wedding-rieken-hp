<template>
    <Card class="card-primary">
        <template #title>
            <h2>{{ t('user.account.header') }}</h2>
        </template>
        <template #content>
            <div class="flex flex-col gap-4">
                <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
                <UpgradeUserRole v-if="userProfile.role === 'guest' && token && token !== ''" class="basis-full" />

                <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                    <!-- Change Password -->
                    <DisplayModal
                        ref="passwordModal"
                        :position="modalPosition"
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
                    <ResetPassword />
                </div>

                <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                    <!-- Delete User Account -->
                    <DisplayModal
                        ref="deleteUserModal"
                        :position="modalPosition"
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
                    <LogoutUser />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import ChangePassword from '@/components/user/ChangePassword.vue'
import ResetPassword from '@/components/user/ResetPassword.vue'
import DeleteUser from '@/components/user/DeleteUser.vue'
import useInvitiationToken from '@/composables/useInvitiationToken'
import { useModalPosition } from '@/composables/useModalPosition'
import { useUserStore } from '@/stores/user'

// TODO: Add email verification button

// Composables
const { t } = useI18n()
const { modalPosition } = useModalPosition() // Modal position

// Refs
const passwordModal = ref<InstanceType<typeof DisplayModal>>()
const deleteUserModal = ref<InstanceType<typeof DisplayModal>>()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)

// Invitation token
const { getInvitiationToken } = useInvitiationToken()
const token = computed(() => getInvitiationToken())
</script>
