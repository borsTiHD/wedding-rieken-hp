<template>
    <div class="flex flex-col items-center gap-4">
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
const spotifyUrl = 'https://open.spotify.com/embed/playlist/1YIe34rcmLjCYpY9wJoM2p?utm_source=generator'
</script>
