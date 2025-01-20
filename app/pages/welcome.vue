<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useConfig } from '@/composables/useConfig'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'

// Composables
const router = useRouter()
const { t, d } = useI18n()
const localePath = useLocalePath()

// Config
const { weddingDate, deadlineDate, isBeforeDeadline } = useConfig()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)

// Watch uid and push to home if user is logged in
watch(uid, (newUid) => {
  if (newUid) { router.push(localePath('/user')) }
})

// On mount
onMounted(() => {
  // If user got no invitation token -> push to home
  if (!token.value || token.value === '') { router.push(localePath('/')) }
  // If user is logged in -> push to user
  else if (uid.value) { router.push(localePath('/user')) }
})
</script>

<template>
  <main class="content-flex w-full sm:max-w-xl">
    <Card>
      <template #title>
        <div class="flex flex-col items-center gap-4">
          <div class="relative inline-block">
            <ShowUnderline color="text-purple-400">
              <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
                {{ t('welcome.header') }}
              </h2>
            </ShowUnderline>
          </div>
        </div>
      </template>
      <template #content>
        <!-- Subheader -->
        <h3 class="font-bold text-xl md:text-2xl">
          {{ t('welcome.subheader') }}
        </h3>

        <!-- Welcome message -->
        <div v-if="isBeforeDeadline" class="flex flex-col items-center gap-4">
          <i18n-t keypath="welcome.welcomeMessage" tag="p">
            <template #weddingDate>
              <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
            </template>
            <template #deadline>
              <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
            </template>
            <template #action>
              <NuxtLink :to="localePath('/register')" class="font-medium text-blue-600">
                {{ t('welcome.loginLinkTag') }}
              </NuxtLink>
            </template>
          </i18n-t>

          <div class="w-full flex gap-4">
            <NuxtLink :to="localePath('/login')" class="w-full">
              <Button class="grow" :label="t('login.submit')" icon="pi pi-sign-in" outlined fluid />
            </NuxtLink>
            <NuxtLink :to="localePath('/register')" class="w-full">
              <Button class="grow" :label="t('register.submit')" icon="pi pi-user-plus" fluid />
            </NuxtLink>
          </div>
        </div>

        <!-- After deadline message -->
        <div v-else class="flex flex-col items-center gap-4">
          <i18n-t keypath="welcome.welcomeMessageAfterDeadline" tag="p">
            <template #weddingDate>
              <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
            </template>
          </i18n-t>
        </div>
      </template>
    </Card>
  </main>
</template>
