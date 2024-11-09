export function useSpotify(spotifyPlaylist: Ref<string | undefined>) {
    // Spotify playlist URL
    const link = computed(() => {
        // Check if spotifyPlaylist is defined
        if (!spotifyPlaylist.value) return ''

        // Use a regular expression to extract the playlist ID from the URL
        // This allows us to use the full URL or just the ID
        // Example with url: https://open.spotify.com/playlist/1YIe34rcmLjCYpY9wJoM2p?si=49c71b4880f449e4
        // Example id only: 1YIe34rcmLjCYpY9wJoM2p
        const match = spotifyPlaylist.value?.match(/playlist\/(\w+)\?/)
        const playlistId = match ? match[1] : spotifyPlaylist

        // Return the full URL
        return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`
    })

    return { link }
}
