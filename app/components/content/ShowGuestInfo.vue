<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'
import { useConfig } from '@/composables/useConfig'
import { whitelistedRoles } from '@/composables/whitelistedRoles'
import { useUserStore } from '@/stores/user'

const { t, d } = useI18n()
const localePath = useLocalePath()

const { weddingDate, deadlineDate, isBeforeDeadline, error } = useConfig()

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-heart" />
      <div class="flex flex-col items-center gap-4">
        <div class="relative inline-block">
          <!-- <ShowUnderline color="text-yellow-400"> -->
          <ShowUnderline color="text-[#ffd4c3]">
            <h2 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
              {{ t('welcome.header') }}
            </h2>
          </ShowUnderline>
        </div>
        <!-- Normal info if user is logged in and has the right role -->
        <div v-if="!error && whitelistedRoles.includes(userProfile?.role) && userProfile?.invitation !== 'declined'" class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <i18n-t v-if="isBeforeDeadline" keypath="welcome.welcomeMessageForGuest" tag="p">
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

          <i18n-t v-else keypath="welcome.welcomeMessageForGuestAfterDeadline" tag="p">
            <template #weddingDate>
              <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
            </template>
          </i18n-t>
        </div>

        <!-- User is logged in as a guest -->
        <div v-else-if="userProfile?.role === 'guest'" class="flex flex-col justify-center items-center gap-4">
          <p class="text-pretty">
            {{ t('welcome.errorGuest') }}
          </p>

          <div class="w-full flex gap-4">
            <NuxtLink :to="localePath('/user')" class="w-full">
              <Button class="grow" :label="t('user.profileButton')" icon="pi pi-user" outlined fluid />
            </NuxtLink>
          </div>
        </div>

        <!-- User is logged in, but is declined -->
        <div v-else-if="userProfile?.role === 'declined'" class="flex flex-col justify-center items-center gap-4">
          <p class="text-pretty">
            {{ t('welcome.errorDeclined') }}
          </p>
        </div>

        <!-- User is logged in, but has declined the invitation -->
        <div v-else-if="userProfile?.invitation === 'declined'" class="flex flex-col justify-center items-center gap-4">
          <i18n-t v-if="isBeforeDeadline" keypath="welcome.errorGuestInvitedButDeclined" tag="p">
            <template #weddingDate>
              <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
            </template>
            <template #deadline>
              <span class="font-bold whitespace-nowrap">{{ d(deadlineDate || 0, 'short') }}</span>
            </template>
          </i18n-t>

          <i18n-t v-else keypath="welcome.errorGuestInvitedButDeclinedAfterDeadline" tag="p">
            <template #weddingDate>
              <span class="font-bold whitespace-nowrap">{{ d(weddingDate || 0, 'short') }}</span>
            </template>
          </i18n-t>
        </div>

        <!-- Not logged in - User is a guest -->
        <div v-else class="flex flex-col justify-center items-center gap-4">
          <p class="text-pretty">
            {{ t('welcome.welcomeMessageUnregistered') }}
          </p>
          <p class="text-pretty">
            {{ t('welcome.welcomeMessageUnregisteredMoreDetails') }}
          </p>

          <div class="w-full flex gap-4">
            <NuxtLink :to="localePath('/login')" class="w-full">
              <Button class="grow" :label="t('login.submit')" icon="pi pi-sign-in" outlined fluid />
            </NuxtLink>
            <NuxtLink :to="localePath('/register')" class="w-full">
              <Button class="grow" :label="t('register.submit')" icon="pi pi-user-plus" fluid />
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
