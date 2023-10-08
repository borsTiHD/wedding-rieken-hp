<template>
    <!-- You are an admin -->
    <div v-if="user.uid && userProfile?.role === 'admin'" class="flex flex-col gap-4">
        <!-- Change date -->
        <Card>
            <template #title>{{ t('admin.listUsers.header') }}</template>
            <template #content>
                <div class="p-2 flex flex-col gap-4">
                    <div class="flex gap-4">
                        <ChangeTimestamp />
                        <DateDisplay :timestamp="config?.weddingDate" />
                    </div>
                    <ShowCountdown :timestamp="config?.weddingDate" />
                </div>
            </template>
        </Card>

        <!-- Create User modal -->
        <DisplayModal
            ref="createUserModal"
            :header="t('admin.createUser.header')"
            buttonClass="basis-1/2"
            :buttonLabel="t('admin.createUser.buttonLabel')"
            buttonIcon="pi pi-user-plus"
            button
        >
            <template #content>
                <CreateUser @created="createUserModal?.close()" />
            </template>
        </DisplayModal>

        <ListUsers />
    </div>

    <!-- You are not an admin -->
    <div v-else>
        <h1 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h1>
    </div>
</template>

<script setup lang="ts">
import DisplayModal from '@/components/DisplayModal.vue'
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import CreateUser from '@/components/admin/CreateUser.vue'
import ListUsers from '@/components/admin/ListUsers.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// Refs
const createUserModal = ref<InstanceType<typeof DisplayModal>>()

// Localisation
const { t } = useI18n()

// App config
const appStore = useAppStore()
const config = computed(() => appStore.config)

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
