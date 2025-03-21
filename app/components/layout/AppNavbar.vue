<script setup lang="ts">
// import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'
import UserQuickMenu from '@/components/settings/UserQuickMenu.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import { useWindowSize } from '@/composables/useWindowSize'
import { useAppStore } from '@/stores/app'
import { usePagesStore } from '@/stores/pages'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'

const appConfig = useAppConfig()

// Localisation
const { t } = useI18n()

// Router
const route = useRoute()
const routeHash = computed(() => route.hash)

// Refs
const showNavbar = ref(true)

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages.filter(page => ![t('pages.imprint')].includes(page.name)))

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
const userProfile = computed(() => userStore.userProfile)

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)

// Scroll event listener
const { scrollY } = useWindowSize(100)
const isScrolled = computed<boolean>(() => scrollY.value > 30)

// App store
const appStore = useAppStore() // App store

// Change theme color on scroll
watch(isScrolled, (newValue) => {
  if (newValue) {
    // After scroll to match navbar background color with footer color
    appStore.setThemeColor(appConfig.theme.surface)
  }
  else {
    // Default theme color
    appStore.setThemeColor(appConfig.theme.body)
  }
})

// Hide navbar on BooBash game start
useRegisterEvent('boo-bash', (running: Event) => {
  showNavbar.value = !running
})
</script>

<template>
  <nav v-if="showNavbar" class="navbar fixed top-0 left-0 w-full z-50">
    <Menubar
      :model="navItems"
      :pt="{
        root: {
          class: [
            'bg-transparent border-none rounded-none',
            { 'bg-white': isScrolled },
          ],
        },
        rootList: {
          class: [
            'p-1 rounded-md bg-white',
            'transition-all duration-300 ease-in-out',
            { 'shadow-md': !isScrolled },
          ],
        },
        itemContent: 'flex items-center justify-center',
        button: {
          class: [
            'h-10 w-10 bg-white rounded-full',
            'transition-all duration-300 ease-in-out hover:bg-gray-200',
            { 'shadow-md': !isScrolled },
          ],
        },
      }"
    >
      <template #item="{ item }">
        <NuxtLink v-slot="{ href, navigate, isActive, isExactActive }" :to="item.path || item.to" custom>
          <a
            :href="href"
            class="p-2 px-3 w-full text-center text-black/60 hover:text-primary/80" :class="[
              {
                'active-link text-primary font-bold': isActive
                  && (typeof item?.to === 'object' && item?.to?.hash // if link hash is provided
                    ? item?.to?.hash === routeHash // check if the link hash is the same as current route hash
                    : !routeHash // if no link hash is provided check if route hash is empty
                  ), // active link also checks if hash fits
                'active-link-exact': isExactActive, // active-exact
              }]"
            @click="navigate"
            @keydown.enter="($event) => navigate($event as unknown as MouseEvent)"
          >
            {{ item.name }}
          </a>
        </NuxtLink>
      </template>
      <template #end>
        <div class="flex items-center gap-2 mr-2">
          <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
          <UpgradeUserRole v-if="(!uid || userProfile.role === 'guest') && token && token !== ''" pill />

          <!-- Language selector -->
          <!-- <ChangeLanguage /> -->

          <!-- User quick menu -->
          <UserQuickMenu />
        </div>
      </template>
    </Menubar>
  </nav>
</template>
