<template>
    <main class="flex flex-col">
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

        <template v-if="user?.uid">
            <!-- WeddingDay -->
            <section id="wedding" class="bg-accent-3">
                <div class="section-style">
                    <div class="flex flex-wrap gap-4">
                        <ShowWeddingDay />
                        <ShowAgenda />
                    </div>
                    <ShowQuote />
                </div>
            </section>

            <!-- Infos -->
            <section id="infos" class="bg-accent">
                <div class="section-style">
                    <div class="flex flex-wrap md:flex-nowrap gap-4">
                        <RouteDescription class="basis-6/12" />
                        <ShowInfos />
                    </div>
                    <ShowQuote />
                </div>
            </section>

            <!-- Spotify Playlist -->
            <section v-if="spotifyPlaylist && cookieConsentSpotify" id="spotify" class="bg-primary">
                <div class="section-style">
                    <ShowSpotify />
                </div>
            </section>

            <!-- Riddle -->
            <section id="riddle" class="">
                <div class="section-style">
                    <ShowRiddle />
                </div>
            </section>
        </template>

        <template v-else>
            <!-- User is not logged in -->
            <section id="not-logged-in" class="bg-accent-3">
                <div class="section-style">
                    <ShowGuestInfo />
                </div>
            </section>
        </template>
    </main>
</template>

<script setup lang="ts">
import { useConfig } from '@/composables/useConfig'
import { useUserStore } from '@/stores/user'
import { useCookieStore } from '@/stores/cookieconsent'
import ShowWeddingDay from '@/components/content/ShowWeddingDay.vue'
import ShowGuestInfo from '@/components/content/ShowGuestInfo.vue'
import ShowRiddle from '@/components/content/ShowRiddle.vue'
import RouteDescription from '@/components/content/RouteDescription.vue'
import ShowAgenda from '@/components/content/ShowAgenda.vue'
import ShowInfos from '@/components/content/ShowInfos.vue'
import ShowQuote from '@/components/content/ShowQuote.vue'
import ShowSpotify from '@/components/content/ShowSpotify.vue'
import { useWindowSize } from '@/composables/useWindowSize'

// Config
const { bride, groom, spotifyPlaylist } = useConfig()

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)

// Cookie consent
const cookieStore = useCookieStore()
const preferences = computed(() => cookieStore.preferences)
const cookieConsentSpotify = computed(() => {
    // Check if cookie consent is accepted for 'spotify' category
    return preferences.value?.acceptedCategories.includes('spotify')
})

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

<style scoped>
.section-style {
    @apply p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4;
}

/* https://10015.io/tools/css-background-pattern-generator */
#not-logged-in, #wedding {
    background:
        radial-gradient(at 80% 80%,rgba(255, 61, 61, 0.23) 25.4%,#0000 26%),
        radial-gradient(at 20% 80%,rgba(255, 61, 61, 0.23) 25.4%,#0000 26%),
        conic-gradient(from -45deg at 50% 41%,rgba(255, 61, 61, 0.23) 90deg,rgba(255, 255, 255, 0) 0) 15px 0;
    background-size: 30px 30px;
}

#infos {
    background:
        conic-gradient(from -45deg at calc(100%/3) calc(100%/3), rgba(255, 255, 255, 0) 90deg, #0000 0),
        conic-gradient(from -135deg at calc(100%/3) calc(2*100%/3), rgba(255, 255, 255, 0) 90deg, rgba(255, 255, 255, 0.1) 0 135deg, #0000 0),
        conic-gradient(from 135deg at calc(2*100%/3) calc(2*100%/3), rgba(255, 255, 255, 0) 90deg, rgba(255, 255, 255, 0.1) 0 135deg, #0000 0),
        conic-gradient(from 45deg at calc(2*100%/3) calc(100%/3), rgba(255, 255, 255, 0) 90deg, rgba(255, 255, 255, 0.1) 0 135deg, #0000 0,rgba(255, 255, 255, 0) 0 225deg,rgba(255, 255, 255, 0.1) 0);
    background-size: 64px 64px;
}

#spotify {
    background:
        conic-gradient(from -45deg,rgba(255, 255, 255, 0.1) 90deg,#0000 0 180deg,rgba(204,204,204,0.1) 0 270deg,#0000 0)
            0 calc(30px/2)/30px 30px,
        conic-gradient(from 135deg at 50% 0,rgba(255, 255, 255, 0.1) 90deg,rgba(204,204,204,0.1) 0)
            0 0/calc(2*30px) 30px;
}

#riddle {
    background-image: radial-gradient(#ff4763 2px, transparent 2px), radial-gradient(#ff4763 2px, transparent 2px);
    background-size: 32px 32px;
    background-position: 0 0, 16px 16px;
    background-color: #d23242;
}
</style>
