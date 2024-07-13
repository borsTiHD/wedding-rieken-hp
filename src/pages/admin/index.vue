<template>
    <main class="mx-auto flex flex-wrap gap-4 p-4 w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
        <ClientOnly>
            <!-- You are an admin -->
            <template v-if="user.uid && userProfile?.role === 'admin'">
                <div class="flex flex-wrap gap-4 w-full">
                    <!-- Change date -->
                    <ChangeWeddingDate class="basis-[40rem]" />

                    <!-- QR Code -->
                    <ShowQRCode class="basis-80" />
                </div>

                <div class="flex flex-wrap gap-4 w-full">
                    <!-- Change deadline -->
                    <ChangeDeadline class="basis-[40rem]" />

                    <!-- Change invite token -->
                    <ChangeInviteToken class="basis-80" />
                </div>

                <div class="flex flex-wrap gap-4 w-full">
                    <ChangeWeddingDuration class="basis-80" />
                    <ChangeLocation class="basis-80" />
                    <ChangeLocationPreview />
                </div>

                <div class="flex flex-wrap gap-4 w-full">
                    <ChangeSpotifyPlaylist />
                </div>
            </template>

            <!-- You are not an admin -->
            <NoAdmin v-else />
        </ClientOnly>
    </main>
</template>

<script setup lang="ts">
import ChangeWeddingDate from '@/components/admin/ChangeWeddingDate.vue'
import ChangeDeadline from '@/components/admin/ChangeDeadline.vue'
import ShowQRCode from '@/components/admin/ShowQRCode.vue'
import ChangeInviteToken from '@/components/admin/ChangeInviteToken.vue'
import ChangeWeddingDuration from '@/components/admin/ChangeWeddingDuration.vue'
import ChangeLocation from '@/components/admin/ChangeLocation.vue'
import ChangeLocationPreview from '@/components/admin/ChangeLocationPreview.vue'
import ChangeSpotifyPlaylist from '@/components/admin/ChangeSpotifyPlaylist.vue'
import NoAdmin from '@/components/admin/NoAdmin.vue'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
