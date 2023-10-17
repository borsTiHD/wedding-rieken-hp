<template>
    <!-- You are an admin -->
    <div v-if="user.uid && userProfile?.role === 'admin'" class="flex flex-col gap-4">
        <!-- Change date -->
        <Card class="grow">
            <template #title>{{ t('admin.changeDate.header') }}</template>
            <template #content>
                <div class="flex flex-col gap-4">
                    <ChangeTimestamp />
                    <div class="flex gap-4">
                        <span class="text-2xl">{{ t('admin.changeDate.label') }}:</span>
                        <DateDisplay :timestamp="config?.weddingDate" />
                    </div>
                    <ShowCountdown :timestamp="config?.weddingDate" />
                </div>
            </template>
        </Card>

        <div class="flex gap-4 flex-wrap">
            <!-- QR Code -->
            <Card class="grow basis-96" :pt="{ content: { class: 'p-0' } }">
                <template #title>{{ t('admin.qrcode.header') }}</template>
                <template #content>
                    <ShowQRCode />
                </template>
            </Card>

            <!-- Change invite token -->
            <Card class="grow basis-96">
                <template #title>{{ t('admin.inviteToken.header') }}</template>
                <template #content>
                    <ChangeInviteToken />
                </template>
            </Card>
        </div>

        <!-- List users datatable -->
        <ListUsers />
    </div>

    <!-- You are not an admin -->
    <div v-else>
        <h1 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h1>
    </div>
</template>

<script setup lang="ts">
import ShowCountdown from '@/components/ShowCountdown.vue'
import DateDisplay from '@/components/DateDisplay.vue'
import ShowQRCode from '@/components/admin/ShowQRCode.vue'
import ChangeTimestamp from '@/components/admin/ChangeTimestamp.vue'
import ChangeInviteToken from '@/components/admin/ChangeInviteToken.vue'
import ListUsers from '@/components/admin/ListUsers.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

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
