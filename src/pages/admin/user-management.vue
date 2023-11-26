<template>
    <main class="mx-auto flex flex-wrap gap-4 p-4 w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
        <!-- You are an admin -->
        <template v-if="user.uid && userProfile?.role === 'admin'">
            <!-- List users datatable -->
            <ListUsers class="basis-full max-w-full" />
        </template>

        <!-- You are not an admin -->
        <Card v-else class="card-primary w-full">
            <template #content>
                <h2 class="text-2xl text-center whitespace-pre-line">{{ t('user.userRole.notAdmin') }}</h2>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import ListUsers from '@/components/admin/ListUsers.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)
</script>
