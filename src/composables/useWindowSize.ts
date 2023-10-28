import { ref } from 'vue'
import { useEventListener } from '@/composables/useEventListener'
export function useWindowSize(timer = 500) {
    // On resize window handler - sets the current window size
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)
    const scrollX = ref(window.scrollX)
    const scrollY = ref(window.scrollY)
    let timeoutResize: ReturnType<typeof setTimeout> | null = null
    let timeoutScroll: ReturnType<typeof setTimeout> | null = null
    // On resize window handler - sets the current window size
    useEventListener(window, 'resize', () => {
        // Start small timeout to prevent multiple calls
        if (!timeoutResize) {
            timeoutResize = setTimeout(() => {
                timeoutResize = null
                windowWidth.value = window.innerWidth
                windowHeight.value = window.innerHeight
            }, timer)
        }
    })
    // On scroll window handler - sets the current scroll position
    useEventListener(window, 'scroll', () => {
        // Start small timeout to prevent multiple calls
        if (!timeoutScroll) {
            timeoutScroll = setTimeout(() => {
                timeoutScroll = null
                scrollX.value = window.scrollX
                scrollY.value = window.scrollY
            }, timer)
        }
    })
    return { windowWidth, windowHeight, scrollX, scrollY }
}
