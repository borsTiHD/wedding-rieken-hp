<template>
    <main class="content-flex w-full sm:max-w-xl">
        <Card>
            <template #title>
                <h2>{{ t('login.header') }}</h2>
            </template>
            <template #content>
                <div v-if="!user.uid" class="flex flex-col gap-4">
                    <Tabs :value="activeTab">
                        <TabList>
                            <Tab value="0">
                                {{ t('login.header') }}
                            </Tab>
                            <Tab value="1">
                                {{ t('login.wihtoutPassword') }}
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
                                <LoginForm />
                            </TabPanel>
                            <TabPanel value="1">
                                <LoginWithEmailLink />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import LoginForm from '@/components/user/LoginForm.vue'
import LoginWithEmailLink from '@/components/user/LoginWithEmailLink.vue'
import { useUserStore } from '@/stores/user'

// Localisation
const { t } = useI18n()
const localePath = useLocalePath()

// Router
const router = useRouter()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const uid = computed(() => userStore.uid)

// Tab Menu
const activeTab = ref('0')

// Watch uid and push to home if user is logged in
watch(uid, (newUid) => {
    if (newUid) { router.push(localePath('/user')) }
})

// On mount
onMounted(() => {
    // Get 'tab' query and set activeTab
    const query = useRouter().currentRoute.value.query
    if (query?.tab && query.tab === 'email') {
        activeTab.value = '1'
    }

    // If user is logged in, push to home
    if (uid.value) { router.push(localePath('/user')) }
})
</script>
