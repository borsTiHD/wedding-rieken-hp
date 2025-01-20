<script setup lang="ts">
import ListUsers from '@/components/admin/ListUsers.vue'
import NoAdmin from '@/components/admin/NoAdmin.vue'
import { useUserStore } from '@/stores/user'

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>

<template>
  <main class="mx-auto flex flex-wrap gap-4 p-4 w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
    <!-- List users datatable -->
    <ListUsers v-if="user.uid && userProfile?.role === 'admin'" class="basis-full max-w-full" />

    <!-- You are not an admin -->
    <NoAdmin v-else />
  </main>
</template>
