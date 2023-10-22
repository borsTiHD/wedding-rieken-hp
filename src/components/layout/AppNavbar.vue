<template>
    <Menubar :model="navItems" class="bg-zinc-100">
        <template #start>
            <NuxtLink :to="homeRoute">
                <div class="flex gap-4 mr-4 items-center">
                    <span class="text-2xl font-bold text-zinc-700 hover:text-zinc-200">{{ appName }}</span>
                </div>
            </NuxtLink>
        </template>
        <template #item="{ item }">
            <NuxtLink v-slot="{ href, navigate, isActive, isExactActive }" :to="item.path" custom>
                <a
                    :href="href"
                    :class="[
                        'p-menuitem-link bg-zinc-100 text-black/60', // default
                        'hover:bg-zinc-200 hover:text-primary/80', // hover - hover:text-black/80
                        {
                            'active-link bg-slate-200 text-primary font-bold': isActive, // active - text-black/60
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
                <!-- Only for testing -->
                <ClientOnly>
                    <ChangeLanguage />
                </ClientOnly>
            </div>
        </template>
    </Menubar>
</template>

<script setup lang="ts">
import ChangeLanguage from '@/components/settings/ChangeLanguage.vue'
import { usePagesStore } from '@/stores/pages'

// App name
const appName = 'TEST_APP'

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)
const homeRoute = { path: '/' } // Home Route
</script>
