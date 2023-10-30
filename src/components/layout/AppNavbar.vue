<template>
    <Menubar :model="navItems" class="!bg-transparent !border-none">
        <template #item="{ item }">
            <NuxtLink v-slot="{ href, navigate, isActive, isExactActive }" :to="item.path" custom>
                <a
                    :href="href"
                    :class="[
                        'p-menuitem-link text-black/60', // default
                        'hover:text-primary/80', // hover - hover:text-black/80
                        {
                            'active-link text-primary font-bold': isActive, // active - text-black/60
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
                <UpgradeUserRole v-if="userProfile.role === 'guest' && token && token !== ''" small />

                <!-- Language selector -->
                <ChangeLanguage />

                <!-- User quick menu -->
                <UserQuickMenu />
            </div>
        </template>
    </Menubar>
</template>

<script setup lang="ts">
import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'
import UserQuickMenu from '@/components/settings/UserQuickMenu.vue'
import UpgradeUserRole from '@/components/user/UpgradeUserRole.vue'
import { usePagesStore } from '@/stores/pages'
import { useUserStore } from '@/stores/user'

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)

// User store
const userStore = useUserStore()
const userProfile = computed(() => userStore.userProfile)

// Invitation token
const { getInvitiationToken } = useInvitiationToken()
const token = computed(() => getInvitiationToken())
</script>
