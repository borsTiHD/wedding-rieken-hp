<template>
    <main class="content-flex w-full sm:max-w-xl">
        <!-- Not logged in -->
        <Card v-if="!uid" class="card-primary">
            <template #title>
                <h2>{{ t('register.header') }}</h2>
            </template>
            <template #content>
                <div class="flex flex-col gap-4">
                    <TabView v-model:activeIndex="activeIndex">
                        <TabPanel :header="t('register.header')">
                            <RegisterForm />
                        </TabPanel>
                        <TabPanel :header="t('login.wihtoutPassword')">
                            <LoginWithEmailLink />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </Card>

        <!-- Already logged in -->
        <Card v-else class="card-primary">
            <template #title>
                <h2>{{ t('login.alreadyLoggedIn') }}</h2>
            </template>
            <template #content>
                <div class="flex flex-col gap-4">
                    <LogoutUser />
                </div>
            </template>
        </Card>
    </main>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/user/RegisterForm.vue'
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
const uid = computed(() => userStore.uid)

// Tab Menu
const activeIndex = ref(0)

// On mount
onMounted(() => {
    // If user is logged in, push to home
    if (uid.value) { router.push(localePath('/')) }
})
</script>
