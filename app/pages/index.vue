<script setup lang="ts">
import ShowAgenda from '@/components/content/ShowAgenda.vue'
import ShowGuestInfo from '@/components/content/ShowGuestInfo.vue'
import ShowInfos from '@/components/content/ShowInfos.vue'
import ShowLocation from '@/components/content/ShowLocation.vue'
import ShowOurStory from '@/components/content/ShowOurStory.vue'
import ShowPicture from '@/components/content/ShowPicture.vue'
import ShowQuote from '@/components/content/ShowQuote.vue'
import ShowSpotify from '@/components/content/ShowSpotify.vue'
import ShowWeddingDay from '@/components/content/ShowWeddingDay.vue'
import FallingEmojis from '@/components/FallingEmojis.vue'
import { useConfig } from '@/composables/useConfig'
import { useWindowSize } from '@/composables/useWindowSize'
import { whitelistedRoles } from '@/composables/whitelistedRoles'
import { useAppStore } from '@/stores/app'
import { useCookieStore } from '@/stores/cookieconsent'
import { useUserStore } from '@/stores/user'
// import ShowRiddle from '@/components/content/ShowRiddle.vue'

// Config
const { spotifyPlaylist } = useConfig()

// App store
const appStore = useAppStore() // App store
const bride = computed(() => appStore.bride)
const groom = computed(() => appStore.groom)

// User store
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.userProfile)

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
const { scrollY } = useWindowSize(undefined, true, true, 2)
const isScrolled = computed<boolean>(() => scrollY.value > 30)

// Returns a shuffled array of numbers from 0 to numberOfQuotes - 1
const randomQuote = computed(() => {
  const numberOfQuotes = 3 // Number of quotes available
  const quotes = Array.from({ length: numberOfQuotes }, (_, i) => i)
  return quotes.sort(() => Math.random() - 0.5)
})

// Scroll to next section
function scrollToSection(hash?: string) {
  const nextSection = hash
    ? document.querySelector<HTMLElement>(hash)
    : document.querySelector<HTMLElement>('section:nth-child(3)')

  if (nextSection) {
    // Get navbar height for offset
    // const navbar = document.querySelector<HTMLElement>('.navbar')
    // const navbarHeight = navbar?.offsetHeight ?? 0
    // const offset = navbarHeight !== 0 ? navbarHeight + 10 : 0
    const offset = hash === '#content' ? 74 : 90

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

<template>
  <main class="flex flex-col">
    <!-- Main content -->
    <section class="h-screen flex justify-center relative overflow-hidden -mt-20">
      <!-- Background image -->
      <div
        class="background-image absolute w-full h-full"
        :style="{ transform: `translateY(${scrollY / 1.5}px)` }"
      />

      <!-- Content wrapper -->
      <div class="h-full w-3/4 sm:w-2/3 xl:w-1/2 flex flex-col">
        <div
          class="wedding-text mt-32 md:mt-24 flex flex-col justify-center text-white select-none"
          :style="{ transform: `translateY(${scrollY / 1.2}px)` }"
        >
          <span class="md:ml-14 font-great-vibes text-7xl md:text-9xl drop-shadow-sm">{{ bride }}</span>
          <span class="pr-2 -mt-8 md:-mt-12 font-great-vibes text-7xl md:text-9xl drop-shadow-sm self-center">&</span>
          <span class="pr-2 md:-mt-2 font-great-vibes text-7xl md:text-9xl drop-shadow-sm self-end">{{ groom }}</span>
        </div>

        <!-- Scroll down icon -->
        <i
          class="z-10 w-fit h-fit p-2 px-3 sm:p-4 rounded-full mt-auto mb-20 text-3xl md:text-5xl self-center text-white drop-shadow-sm pi pi-angle-down motion-safe:animate-bounce motion-reduce:animate-none cursor-pointer hover:bg-white/30 hover:rounded-full hover:shadow-lg"
          :class="[isScrolled ? 'opacity-0' : 'opacity-100']"
          @click="scrollToSection('#content')"
        />
      </div>
    </section>

    <!-- Falling emojis -->
    <FallingEmojis :key="user?.uid || 1234" />

    <div id="content" class="content-area">
      <div v-if="user?.uid && whitelistedRoles.includes(userProfile?.role) && userProfile?.invitation !== 'declined'" class="wrapper-style">
        <!-- WeddingDay -->
        <section id="wedding" class="section-style">
          <div class="flex flex-wrap gap-4">
            <ShowWeddingDay />
            <ShowAgenda />
          </div>
          <ShowQuote :number="randomQuote[0]" />
        </section>

        <!-- Infos -->
        <section id="infos" class="section-style">
          <div class="flex flex-wrap gap-4">
            <ShowLocation class="basis-64" />
            <ShowInfos class="basis-96" />
          </div>
          <ShowQuote :number="randomQuote[1]" />
        </section>

        <!-- Our Story -->
        <section id="our-story" class="section-style">
          <div class="flex flex-wrap gap-4">
            <ShowOurStory class="basis-96" />
            <ShowPicture class="basis-80" />
          </div>
        </section>

        <!-- Spotify Playlist -->
        <section v-if="spotifyPlaylist && cookieConsentSpotify" id="spotify" class="section-style">
          <ShowSpotify />
        </section>

        <!-- Riddle -->
        <!-- <section id="riddle" class="section-style">
          <ShowRiddle />
        </section> -->
      </div>

      <div v-else class="wrapper-style">
        <!-- User is not whitelisted - e.p. not logged in, or not invited -->
        <section id="not-whitelisted" class="section-style items-center">
          <div class="max-w-2xl">
            <ShowGuestInfo />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.background-image, .wedding-text {
    transition: transform 0.2s ease-out;
}

@media (min-width: 768px) {
    .background-image, .wedding-text {
        transition: none;
    }
}

.content-area {
    @apply flex flex-col gap-4;
    background: linear-gradient(to right, #f2cac0, #f2b69a);
    background-size: 400% 400%;
    animation: gradientAnimation 5s ease infinite;
}

.wrapper-style {
    @apply p-4 mx-auto sm:w-11/12 md:w-10/12 lg:w-8/12 flex flex-col gap-4 z-10;
}

.section-style {
    @apply flex flex-col gap-4;
}

/* #not-whitelisted {
    background: linear-gradient(to right, #ffecd2, #fcb69f);
    background-size: 400% 400%;
    animation: gradientAnimation 5s ease infinite;
}

#wedding {
    background: linear-gradient(to right, #ffecd2, #fcb69f);
    background-size: 400% 400%;
    animation: gradientAnimation 5s ease infinite;
}

#infos {
    background: linear-gradient(to right, #ff9a9e, #fecfef);
    background-size: 400% 400%;
    animation: gradientAnimation 5s ease infinite;
}

#spotify {
    background: linear-gradient(to right, #a1c4fd, #c2e9fb);
    background-size: 400% 400%;
    animation: gradientAnimation 5s ease infinite;
}

#riddle {
    background: linear-gradient(to right, #fbc2eb, #a6c1ee);
    background-size: 400% 400%;
    animation: gradientAnimation 5s ease infinite;
} */

@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
