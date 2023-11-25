<template>
    <main class="mx-auto flex flex-col gap-4 p-4 w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
        <!-- You are an admin -->
        <template v-if="user.uid && userProfile?.role === 'admin'">
            <div class="flex gap-4 flex-wrap">
                <!-- Change date -->
                <ChangeWeddingDate />

                <!-- QR Code -->
                <ShowQRCode />
            </div>

            <!-- Change invite token -->
            <ChangeInviteToken />

            <!-- List users datatable -->
            <ListUsers />
        </template>

        <!-- You are not an admin -->
        <Card v-else class="card-primary">
            <template #content>
                <h2 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h2>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import ChangeWeddingDate from '@/components/admin/ChangeWeddingDate.vue'
import ShowQRCode from '@/components/admin/ShowQRCode.vue'
import ChangeInviteToken from '@/components/admin/ChangeInviteToken.vue'
import ListUsers from '@/components/admin/ListUsers.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
