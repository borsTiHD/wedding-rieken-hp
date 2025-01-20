<script setup lang="ts">
import LoginWithEmailLink from '@/components/user/LoginWithEmailLink.vue'
import RegisterForm from '@/components/user/RegisterForm.vue'
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
const activeTab = ref('0')

// On mount
onMounted(() => {
  // If user is logged in, push to home
  if (uid.value) {
    router.push(localePath('/user'))
  }
})
</script>

<template>
  <main class="content-flex w-full sm:max-w-xl">
    <!-- Not logged in -->
    <Card v-if="!uid">
      <template #title>
        <h2>{{ t('register.header') }}</h2>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <Tabs :value="activeTab">
            <TabList>
              <Tab value="0">
                {{ t('register.header') }}
              </Tab>
              <Tab value="1">
                {{ t('login.wihtoutPassword') }}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="0">
                <RegisterForm />
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
