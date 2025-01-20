<script setup lang="ts">
import ChangeDeadline from '@/components/admin/ChangeDeadline.vue'
import ChangeInviteToken from '@/components/admin/ChangeInviteToken.vue'
import ChangeLocation from '@/components/admin/ChangeLocation.vue'
import ChangeLocationPreview from '@/components/admin/ChangeLocationPreview.vue'
import ChangeSpotifyPlaylist from '@/components/admin/ChangeSpotifyPlaylist.vue'
import ChangeWeddingDate from '@/components/admin/ChangeWeddingDate.vue'
import ChangeWeddingDuration from '@/components/admin/ChangeWeddingDuration.vue'
import NoAdmin from '@/components/admin/NoAdmin.vue'
import ShowQRCode from '@/components/admin/ShowQRCode.vue'
import UpdateDailyAgenda from '@/components/admin/UpdateDailyAgenda.vue'
import UpdateWitnesses from '@/components/admin/UpdateWitnesses.vue'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>

<template>
  <main class="mx-auto flex flex-wrap gap-4 p-4 w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
    <ClientOnly>
      <!-- You are an admin -->
      <div
        v-if="user.uid && userProfile?.role === 'admin'"
        class="flex flex-wrap gap-4 w-full"
      >
        <ChangeWeddingDate class="basis-[40rem]" />
        <ShowQRCode class="basis-80" />
        <ChangeDeadline class="basis-[40rem]" />
        <ChangeInviteToken class="basis-80" />
        <ChangeWeddingDuration class="basis-80" />
        <ChangeLocation class="basis-80" />
        <ChangeLocationPreview />
        <ChangeSpotifyPlaylist />
        <UpdateDailyAgenda />
        <UpdateWitnesses />
      </div>

      <!-- You are not an admin -->
      <div v-else class="flex flex-wrap gap-4 w-full">
        <NoAdmin />
      </div>
    </ClientOnly>
  </main>
</template>
