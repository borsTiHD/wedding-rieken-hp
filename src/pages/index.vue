<template>
    <main class="mx-auto flex flex-col">
        <!-- Main content -->
        <section class="h-screen flex justify-center relative overflow-hidden -mt-20">
            <!-- Background image -->
            <div
                class="background-image absolute w-full h-full"
                :style="{ transform: `translateY(${scrollY / 2}px)` }"
            />

            <!-- Content wrapper -->
            <div class="h-full w-3/4 sm:w-2/3 xl:w-1/2 flex flex-col">
                <div
                    class="mt-auto flex flex-col justify-center text-white"
                    :style="{ transform: `translateY(${scrollY / 4}px)` }"
                >
                    <span class="font-great-vibes text-7xl md:text-9xl drop-shadow-sm">{{ bride }}</span>
                    <span class="font-great-vibes text-7xl md:text-9xl drop-shadow-sm self-center">&</span>
                    <span class="font-great-vibes text-7xl md:text-9xl drop-shadow-sm self-end">{{ groom }}</span>
                </div>

                <!-- Scroll down icon -->
                <i
                    :class="[
                        isScrolled ? 'opacity-0' : 'opacity-100',
                        'mt-auto mb-20 text-3xl md:text-5xl self-center ', // Sizes
                        'text-white drop-shadow-sm pi pi-angle-down', // Icon
                        'motion-safe:animate-bounce motion-reduce:animate-none', // Animation
                        'cursor-pointer hover:bg-white/30 hover:rounded-full hover:shadow-lg' // Hover
                    ]"
                    @click="scrollToSection()"
                />
            </div>
        </section>

        <!-- WeddingDay -->
        <section id="wedding" class="bg-[#540B0E]">
            <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    <ShowWeddingDay />
                    <ShowProcedure />
                </div>
                <ShowQuote />
            </div>
        </section>

        <!-- Infos -->
        <section id="infos" class="bg-[#E09F3E]">
            <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
                <div class="flex flex-wrap md:flex-nowrap gap-4">
                    <RouteDescription class="basis-6/12" />
                    <ShowInfos />
                </div>
                <ShowQuote />
            </div>
        </section>

        <!-- Spotify Playlist -->
        <section v-if="spotifyPlaylist" id="spotify" class="bg-[#335C67]">
            <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
                <ShowSpotify />
            </div>
        </section>

        <!-- Gallery -->
        <section id="infos" class="bg-[#540B0E]">
            <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
                <GalleryAlbum />
            </div>
        </section>

        <!-- Riddle -->
        <section id="infos" class="bg-[#E09F3E]">
            <div class="p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4">
                <ShowRiddle />
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ShowWeddingDay from '@/components/content/ShowWeddingDay.vue'
import ShowRiddle from '@/components/content/ShowRiddle.vue'
import RouteDescription from '@/components/content/RouteDescription.vue'
import ShowProcedure from '@/components/content/ShowProcedure.vue'
import ShowInfos from '@/components/content/ShowInfos.vue'
import ShowQuote from '@/components/content/ShowQuote.vue'
import ShowSpotify from '@/components/content/ShowSpotify.vue'
import GalleryAlbum from '@/components/content/GalleryAlbum.vue'
import { useWindowSize } from '@/composables/useWindowSize'

// App config
const appStore = useAppStore()
const { bride, groom, spotifyPlaylist } = appStore

// Router
const route = useRoute()
const routeHash = computed(() => route.hash)

// Scroll event listener
const { scrollY } = useWindowSize(undefined, true)
const isScrolled = computed<boolean>(() => scrollY.value > 30)

// Scroll to next section
const scrollToSection = (hash?: string) => {
    const nextSection = hash ? document.querySelector<HTMLElement>(hash)
        : document.querySelector<HTMLElement>('section:nth-child(2)')

    if (nextSection) {
        // Get navbar height for offset
        const navbar = document.querySelector<HTMLElement>('.navbar')
        const offset = navbar?.offsetHeight || 0

        // Calculate new Y-Value based on the next section
        // 16px offset because the navbar has a padding of 16px if the page is not scrolled
        const nextSectionY = nextSection.getBoundingClientRect().top + window.scrollY - offset + 16

        // Scroll to next section with smooth behavior and offset
        window.scrollTo({ top: nextSectionY, behavior: 'smooth' })
    }
}

watch(routeHash, (newValue) => {
    if (newValue) {
        setTimeout(() => scrollToSection(newValue), 100)
    }
})

onMounted(() => {
    // Scroll to section if hash is present
    if (window.location.hash) {
        setTimeout(() => scrollToSection(window.location.hash), 100)
    }
})
</script>
