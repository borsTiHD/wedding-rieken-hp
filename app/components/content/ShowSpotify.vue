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

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useCookieStore } from '@/stores/cookieconsent'

// App config
const appStore = useAppStore()
const { spotifyPlaylist } = appStore

// Cookie consent
const cookieStore = useCookieStore()
const preferences = computed(() => cookieStore.preferences)
const cookieConsentSpotify = computed(() => {
    // Check if cookie consent is accepted for 'spotify' category
    return preferences.value?.acceptedCategories.includes('spotify')
})

// Computed property for the Spotify URL
const spotifyUrl = computed(() => {
    // Check if spotifyPlaylist is defined
    if (!spotifyPlaylist) return ''

    // Use a regular expression to extract the playlist ID from the URL
    // This allows us to use the full URL or just the ID
    // Example with url: https://open.spotify.com/playlist/1YIe34rcmLjCYpY9wJoM2p?si=49c71b4880f449e4
    // Example id only: 1YIe34rcmLjCYpY9wJoM2p
    const match = spotifyPlaylist.match(/playlist\/(\w+)\?/)
    const playlistId = match ? match[1] : spotifyPlaylist

    // Return the full URL
    return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`
})
</script>
