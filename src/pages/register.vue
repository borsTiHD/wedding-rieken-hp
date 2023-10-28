<template>
    <Card>
        <template #content>
            <div v-if="!uid" class="flex flex-col gap-4">
                <h1 class="text-2xl">{{ t('register.header') }}:</h1>
                <TabView v-model:activeIndex="activeIndex">
                    <TabPanel :header="t('register.header')">
                        <RegisterForm />
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
