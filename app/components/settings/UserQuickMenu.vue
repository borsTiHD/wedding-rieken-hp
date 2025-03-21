<script setup lang="ts">
import DisplayAvatar from '@/components/user/DisplayAvatar.vue'
import DisplayProfileProgress from '@/components/user/DisplayProfileProgress.vue'
import { useUserStore } from '@/stores/user'
import Popover from 'primevue/popover'
import { useToast } from 'primevue/usetoast'

// Composables
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { $CookieConsent } = useNuxtApp()
const { logoutUser } = useFirebaseAuth()
const { checkState } = useProfileChecker()

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
const displayName = computed(() => userStore.displayName)

// Overlay panel
const op = ref<typeof Popover | null>(null)
function showOverlayPanel(event: PointerEvent | KeyboardEvent) {
  // @ts-expect-error - Property 'toggle' does exist on primevue/popover
  op.value?.toggle(event)
}

// Change route and close overlay panel
function routeChange(route: string) {
  // @ts-expect-error - Property 'hide' does exist on primevue/popover
  op.value?.hide()
  router.push(localePath(route))
}

// Logout button
async function logout() {
  await logoutUser()
    .then(() => {
      toast.add({
        severity: 'success',
        summary: t('logout.success'),
        detail: t('logout.successDetail'),
        life: 3000,
      })
    })
    .catch((error: { message: string }) => {
      toast.add({
        severity: 'error',
        summary: t('logout.error'),
        detail: error.message,
        life: 10000,
      })
    })

  // @ts-expect-error - Property 'hide' does exist on primevue/popover
  op.value?.hide()
}
</script>

<template>
  <div class="flex">
    <!-- Avatar - click opens the overlay -->
    <DisplayAvatar
      tabindex="0"
      mode="button"
      size="sm"
      circle
      @click="showOverlayPanel"
      @keydown.enter="showOverlayPanel"
    />

    <Popover ref="op">
      <div class="w-full sm:w-96 flex flex-col items-center gap-4">
        <DisplayAvatar circle />

        <!-- If user is logged in -->
        <template v-if="uid">
          <!-- Display name -->
          <h1 class="text-2xl font-semibold">
            {{ displayName ? displayName : t('user.noName') }}
          </h1>

          <!-- Profile progress with link -->
          <div v-if="checkState < 100" tabindex="0" class="flex items-center px-0 sm:px-8 w-full cursor-pointer hover:text-neutral-400" @click="routeChange('/user/profile/')" @keydown.enter="routeChange('/user/profile/')">
            <span>{{ t('userQuickMenu.completeProfile') }}</span>
            <!-- Profile progress with link -->
            <DisplayProfileProgress class="ml-auto" />
          </div>

          <!-- List  with links to profile, settings, logout, etc. -->
          <ul class="flex flex-col divide-y px-0 sm:px-8 w-full">
            <li tabindex="0" class="quick-menu-list-item hover:text-neutral-400" @click="routeChange('/user')" @keydown.enter="routeChange('/user')">
              <span>{{ t('pages.user') }}</span>
              <i class="pi pi-chevron-right" />
            </li>
            <li tabindex="0" class="quick-menu-list-item hover:text-neutral-400" @click="routeChange('/user/account')" @keydown.enter="routeChange('/user/account')">
              <span>{{ t('pages.account') }}</span>
              <i class="pi pi-chevron-right" />
            </li>
            <li class="quick-menu-list-item hover:text-neutral-400" @click="$CookieConsent.showPreferences()" @keydown.enter="$CookieConsent.showPreferences()">
              <span>{{ t('consent.preferences') }}</span>
              <i class="pi pi-chevron-right" />
            </li>
            <li tabindex="0" class="quick-menu-list-item hover:text-red-400" @click="logout" @keydown.enter="logout">
              <span>{{ t('logout.submit') }}</span>
            </li>
          </ul>
        </template>

        <!-- If user is NOT logged in -->
        <template v-else>
          <!-- Display name -->
          <h1 class="text-2xl font-semibold">
            {{ t('login.notLoggedIn') }}
          </h1>

          <!-- List  with links to profile, settings, logout, etc. -->
          <ul tabindex="0" class="flex flex-col px-0 sm:px-8 w-full">
            <li class="quick-menu-list-item hover:text-neutral-400" @click="routeChange('/login')" @keydown.enter="routeChange('/login')">
              <span>{{ t('login.submit') }}</span>
              <i class="pi pi-chevron-right" />
            </li>
            <li class="quick-menu-list-item hover:text-neutral-400" @click="$CookieConsent.showPreferences()" @keydown.enter="$CookieConsent.showPreferences()">
              <span>{{ t('consent.preferences') }}</span>
              <i class="pi pi-chevron-right" />
            </li>
          </ul>
        </template>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
/* Profile list items */
.quick-menu-list-item {
    @apply flex items-center justify-between py-2 cursor-pointer !important;
}
</style>
