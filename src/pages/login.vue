<template>
    <div class="m-4 flex flex-col gap-4 p-4 border border-gray-400">
        <div v-if="!user.uid" class="flex flex-col gap-4">
            <h1 class="text-2xl">{{ t('login.header') }}:</h1>
            <TabView v-model:activeIndex="activeIndex">
                <TabPanel :header="t('login.header')">
                    <LoginForm />
                </TabPanel>
                <TabPanel :header="t('login.wihtoutPassword')">
                    <LoginWithEmailLink />
                </TabPanel>
            </TabView>
        </div>

        <div v-else class="flex flex-col gap-4">
            <h1 class="text-2xl">{{ t('login.alreadyLoggedIn') }}:</h1>
            <LogoutUser />
        </div>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/user/LoginForm.vue'
import LoginWithEmailLink from '@/components/user/LoginWithEmailLink.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)

// Tab Menu
const activeIndex = ref(0)

onMounted(() => {
    // Get 'tab' query and set activeIndex
    const query = useRouter().currentRoute.value.query
    if (query?.tab && query.tab === 'email') {
        activeIndex.value = 1
    }
})
</script>
