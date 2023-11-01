<template>
    <main class="mx-auto flex flex-col gap-4 p-4 sm:w-11/12 md:w-10/12 lg:w-8/12">
        <!-- You are an admin -->
        <template v-if="user.uid && userProfile?.role === 'admin'">
            <div class="flex gap-4 flex-wrap">
                <!-- Change date -->
                <Card class="card-primary grow">
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
                <!-- QR Code -->
                <Card class="card-primary grow" :pt="{ content: { class: 'p-0' } }">
                    <template #title>{{ t('admin.qrcode.header') }}</template>
                    <template #content>
                        <ShowQRCode />
                    </template>
                </Card>
            </div>

            <!-- Change invite token -->
            <Card class="card-primary grow" :pt="{ content: { class: 'pb-0' } }">
                <template #title>{{ t('admin.inviteToken.header') }}</template>
                <template #content>
                    <ChangeInviteToken />
                </template>
            </Card>

            <!-- List users datatable -->
            <ListUsers />
        </template>

        <!-- You are not an admin -->
        <Card v-else class="card-primary">
            <template #content>
                <h1 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h1>
            </template>
        </Card>
    </main>
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
