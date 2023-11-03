<template>
    <footer class="mt-auto flex justify-center items-center h-56 bg-footer text-white"> <!-- bg-gray-200 text-black/80 -->
        <div class="flex flex-col justify-center items-center gap-2">
            <span>{{ t('footer.description', { bride, groom }) }}</span>
            <div class="flex gap-2">
                <NuxtLink
                    v-for="(item) in navItems"
                    :key="item.path"
                    :to="item.path"
                    class="link link-hover hover:text-rose-500"
                >
                    {{ item.name }}
                </NuxtLink>
            </div>
            <p class="flex items-end gap-2 font-weight-thin">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4Z" /></svg>
                with
                <svg xmlns="http://www.w3.org/2000/svg" class="text-rose-500" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" /></svg>
                in Germany
                <NuxtLink :to="githubRepo" target="_blank" class="link link-hover hover:text-rose-500"><i class="pi pi-github" /></NuxtLink>
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { usePagesStore } from '@/stores/pages'
import { useAppStore } from '@/stores/app'

// Localisation
const { t } = useI18n()

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)

// App store
const appStore = useAppStore()
const bride = computed(() => appStore.bride)
const groom = computed(() => appStore.groom)

// Github repo link
const githubRepo = 'https://github.com/borsTiHD/wedding-rieken-hp/'
</script>
