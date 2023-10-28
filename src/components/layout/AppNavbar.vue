<template>
    <Menubar :model="navItems" class="bg-transparent border-none">
        <template #item="{ item }">
            <NuxtLink v-slot="{ href, navigate, isActive, isExactActive }" :to="item.path" custom>
                <a
                    :href="href"
                    :class="[
                        'p-menuitem-link bg-transparent text-black/60', // default
                        'hover:text-primary/80', // hover - hover:text-black/80
                        {
                            'active-link text-primary font-bold': isActive, // active - text-black/60
                            'active-link-exact': isExactActive // active-exact
                        }]"
                    @click="navigate"
                >
                    {{ item.name }}
                </a>
            </NuxtLink>
        </template>
        <template #end>
            <div class="flex items-center gap-2 mr-2">
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
import { usePagesStore } from '@/stores/pages'

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)
</script>
