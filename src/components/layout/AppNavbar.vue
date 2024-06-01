<template>
    <nav
        class="navbar fixed top-0 left-0 w-full z-50"
        :class="{ 'bg-white': isScrolled }"
    >
        <Menubar
            :model="navItems"
            :pt="{
                root: {
                    class: [
                        'bg-transparent border-none rounded-none',
                        { 'shadow-md': isScrolled }
                    ]
                },
                menu: {
                    class: [
                        'p-1 rounded-md transition-all duration-300 ease-in-out',
                        { 'bg-white shadow-md': !isScrolled }
                    ]
                }
            }"
        >
            <template #item="{ item }">
                <NuxtLink v-slot="{ href, navigate, isActive, isExactActive }" :to="item.path || item.to" custom>
                    <a
                        :href="href"
                        :class="[
                            'p-menuitem-link text-black/60', // default
                            'hover:text-primary/80', // hover - hover:text-black/80
                            {
                                'active-link text-primary font-bold': isActive &&
                                    (typeof item?.to === 'object' && item?.to?.hash // if link hash is provided
                                        ? item?.to?.hash === routeHash // check if the link hash is the same as current route hash
                                        : !routeHash // if no link hash is provided check if route hash is empty
                                    ), // active link also checks if hash fits
                                'active-link-exact': isExactActive // active-exact
                            }]"
                        @click="navigate"
                        @keydown.enter="navigate"
                    >
                        {{ item.name }}
                    </a>
                </NuxtLink>
            </template>
            <template #end>
                <div class="flex items-center gap-2 mr-2">
                    <!-- Upgrade User Role - only visible if user is 'guest' and he has a invitation token -->
                    <div v-if="(!uid || userProfile.role === 'guest') && token && token !== ''" class="flex items-center gap-2">
                        <div class="p-2 flex gap-1 items-center text-sm bg-green-200 rounded-lg">
                            <span class="text-green-600">{{ `${t('general.invitation')} >` }}</span>
                        </div>
                        <UpgradeUserRole small />
                    </div>

                    <!-- Language selector -->
                    <ChangeLanguage />

                    <!-- User quick menu -->
                    <UserQuickMenu />
                </div>
            </template>
        </Menubar>
    </nav>
</template>

<script setup lang="ts">
import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'
import UserQuickMenu from '@/components/settings/UserQuickMenu.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import { useWindowSize } from '@/composables/useWindowSize'
import { useAppStore } from '@/stores/app'
import { usePagesStore } from '@/stores/pages'
import { useUserStore } from '@/stores/user'
import { useTokenStore } from '@/stores/token'

const { t } = useI18n()

// Router
const route = useRoute()
const routeHash = computed(() => route.hash)

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)

// User store
const userStore = useUserStore()
const uid = computed(() => userStore.uid)
const userProfile = computed(() => userStore.userProfile)

// Invitation token
const tokenStore = useTokenStore()
const token = computed(() => tokenStore.token)
console.log('token', token.value)

// Scroll event listener
const { scrollY } = useWindowSize(100)
const isScrolled = computed<boolean>(() => scrollY.value > 30)

// App store
const appStore = useAppStore() // App store

// Change theme color on scroll
watch(isScrolled, (newValue) => {
    if (newValue) {
        // After scroll to match navbar background
        appStore.setThemeColor('#fff')
    } else {
        // Default theme color
        appStore.setThemeColor('#cbc8c6')
    }
})
</script>
