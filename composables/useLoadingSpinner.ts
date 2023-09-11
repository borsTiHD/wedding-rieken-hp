import { ref } from 'vue'

export default function(beginLoading?: boolean) {
    const loading = ref(true)
    const progress = ref(0)
    const interval = ref<null | ReturnType<typeof setInterval>>(null)

    // Start loading function
    const startLoading = () => {
        const intervalTime = 100 / 60 * 5
        interval.value = setInterval(() => {
            if (progress.value < 100) {
                progress.value += 1
            } else {
                loading.value = false
                if (!interval.value) return false
                clearInterval(interval.value) // Stop interval
            }
        }, intervalTime)
    }

    // Start loading if startLoading is true
    if (beginLoading) { startLoading() }

    return {
        loading, // Loading state
        progress, // Progress of loading
        startLoading, // Manually start loading if 'beginLoading' is false
        interval // Used to stop interval
    }
}
