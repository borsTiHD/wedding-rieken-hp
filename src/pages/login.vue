<template>
    <main class="content-wrapper">
        <Card class="card-primary">
            <template #content>
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
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import LoginForm from '@/components/user/LoginForm.vue'
import LoginWithEmailLink from '@/components/user/LoginWithEmailLink.vue'
import LogoutUser from '@/components/user/LogoutUser.vue'
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
const activeIndex = ref(0)

// Watch uid and push to home if user is logged in
watch(uid, (newUid) => {
    if (newUid) { router.push(localePath('/')) }
})

// On mount
onMounted(() => {
    // Get 'tab' query and set activeIndex
    const query = useRouter().currentRoute.value.query
    if (query?.tab && query.tab === 'email') {
        activeIndex.value = 1
    }

    // If user is logged in, push to home
    if (uid.value) { router.push(localePath('/')) }
})
</script>
