import { ref } from 'vue'

export default function(beginLoading?: boolean, endAutomaticly?: boolean) {
    const loading = ref(true)
    const progress = ref(0)
    const interval = ref<null | ReturnType<typeof setInterval>>(null)

    // Start loading function
    const startLoading = () => {
        const intervalTime = 50 // 5 seconds to 100%
        const maxProgress = 99 // Max progress
        interval.value = setInterval(() => {
            if (progress.value < maxProgress) {
                progress.value += 1
            } else {
                if (endAutomaticly) { loading.value = false } // Stop loading if endAutomaticly is true
                if (!interval.value) return false
                clearInterval(interval.value) // Stop interval
            }
        }, intervalTime)
    }

    // Stop loading function
    const stoptLoading = () => {
        if (interval.value) clearInterval(interval.value) // Stop interval
        loading.value = false // Stop loading
    }

    // Start loading if startLoading is true
    if (beginLoading) { startLoading() }

    return {
        loading, // Loading state
        progress, // Progress of loading
        startLoading, // Manually start loading if 'beginLoading' is false
        stoptLoading, // Manually stop loading
        interval // Used to stop interval
    }
}
