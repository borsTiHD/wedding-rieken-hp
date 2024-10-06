<template>
    <footer v-if="showFooter" ref="footer" class="mt-auto flex justify-center items-center h-56 bg-surface text-primary font-great-vibes z-50">
        <div class="flex flex-col justify-center items-center gap-2 z-50">
            <span>{{ t('footer.description', { bride, groom }) }}</span>
            <div class="mx-auto flex flex-wrap justify-center gap-2">
                <template
                    v-for="(item, index) in navItems"
                    :key="item.path"
                >
                    <NuxtLink :to="item.path || item.to" class="link link-hover hover:text-rose-500 px-1">
                        {{ item.name }}
                    </NuxtLink>
                    <span v-if="index < navItems.length - 1" class="font-roboto">|</span>
                </template>
            </div>
            <p class="flex items-end gap-2 font-weight-thin">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4Z" /></svg>
                with
                <svg xmlns="http://www.w3.org/2000/svg" class="text-rose-500 heartbeat" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" /></svg>
                in Germany
                <NuxtLink :to="githubRepo" target="_blank" class="link link-hover hover:text-rose-500"><i class="pi pi-github" /></NuxtLink>
            </p>
        </div>

        <!-- Background overlay - used to overlay the background image -->
        <div
            ref="backgroundOverlay"
            class="bg-surface fixed w-full bottom-0 left-0 z-0 pointer-events-none"
            :style="{ height: `${backgroundOverlayHeight}px` }"
        />
    </footer>
</template>

<script setup lang="ts">
import { usePagesStore } from '@/stores/pages'
import { useAppStore } from '@/stores/app'
import { useEventListener } from '@/composables/useEventListener'

// Localisation
const { t } = useI18n()

// Refs
const showFooter = ref(true)

// Navitems
const pagesStore = usePagesStore()
const navItems = computed(() => pagesStore.pages)

// App store
const appStore = useAppStore()
const bride = computed(() => appStore.bride)
const groom = computed(() => appStore.groom)

// Github repo link
const githubRepo = 'https://github.com/borsTiHD/wedding-rieken-hp/'

// Scroll event listener - calculate the height of the background overlay
const backgroundOverlayHeight = ref(0)
useEventListener(window, 'scroll', () => { backgroundOverlayHeight.value = calculateHeight() })

// Calculate the height of the background overlay
// This function is called on scroll event
const footer = ref<HTMLElement | null>(null)
const calculateHeight = () => {
    if (!!footer.value) {
        const rect = footer.value.getBoundingClientRect()
        const scrollPosition = window.innerHeight - rect.top

        // If the height is greater than 50,
        // reduce it by half the height of the footer
        if (scrollPosition > 50) {
            return scrollPosition - (rect.height / 2)
        }

        // If the height is greater than 0,
        // return the height
        return scrollPosition > 0 ? scrollPosition : 0
    }

    // If the footer is not set, return 0
    return 0
}

// Hide footer on BooBash game start
useRegisterEvent('boo-bash', (running: Event) => {
    showFooter.value = !running
})
</script>
