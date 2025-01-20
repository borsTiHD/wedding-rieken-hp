<script setup lang="ts">
import { useConfig } from '@/composables/useConfig'
import { useSpotify } from '@/composables/useSpotify'
import { useCookieStore } from '@/stores/cookieconsent'

// Config
const { spotifyPlaylist } = useConfig()
const { link: spotifyUrl } = useSpotify(spotifyPlaylist)

// Cookie consent
const cookieStore = useCookieStore()
const preferences = computed(() => cookieStore.preferences)
const cookieConsentSpotify = computed(() => {
  // Check if cookie consent is accepted for 'spotify' category
  return preferences.value?.acceptedCategories.includes('spotify')
})
</script>

<template>
  <div v-if="spotifyPlaylist && cookieConsentSpotify" class="flex flex-col items-center gap-4">
    <iframe
      style="border-radius:12px"
      :src="spotifyUrl"
      width="100%"
      height="352"
      frameBorder="0"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  </div>
</template>
