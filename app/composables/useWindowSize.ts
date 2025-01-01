import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { useEventListener } from '@/composables/useEventListener'

export function useWindowSize(timer = 500, noTimeout = false, useThrottle = false, throttleTimer = 200) {
    // Check if window is defined (SSR)
    if (typeof window === 'undefined' || !window) {
        return {
            windowWidth: ref(0),
            windowHeight: ref(0),
            scrollX: ref(0),
            scrollY: ref(0)
        }
    }

    // On resize window handler - sets the current window size
    const windowWidth = ref(window.innerWidth)
    const windowHeight = ref(window.innerHeight)
    const scrollX = ref(window.scrollX)
    const scrollY = ref(window.scrollY)

    let timeoutResize: ReturnType<typeof setTimeout> | null = null
    let timeoutScroll: ReturnType<typeof setTimeout> | null = null

    const onResize = () => {
        // If no timeout is set, update the values immediately
        if (noTimeout) {
            windowWidth.value = window.innerWidth
            windowHeight.value = window.innerHeight
            return true
        }

        // Start small timeout to prevent multiple calls
        if (!timeoutResize) {
            timeoutResize = setTimeout(() => {
                timeoutResize = null
                windowWidth.value = window.innerWidth
                windowHeight.value = window.innerHeight
            }, timer)
        }
    }

    const onScroll = () => {
        // If no timeout is set, update the values immediately
        if (noTimeout) {
            scrollX.value = window.scrollX
            scrollY.value = window.scrollY
            return true
        }

        // Start small timeout to prevent multiple calls
        if (!timeoutScroll) {
            timeoutScroll = setTimeout(() => {
                timeoutScroll = null
                scrollX.value = window.scrollX
                scrollY.value = window.scrollY
            }, timer)
        }
    }

    // Add event listeners
    if (useThrottle) {
        useEventListener(window, 'resize', useThrottleFn(onResize, throttleTimer))
        useEventListener(window, 'scroll', useThrottleFn(onScroll, throttleTimer))
    } else {
        useEventListener(window, 'resize', onResize)
        useEventListener(window, 'scroll', onScroll)
    }

    return { windowWidth, windowHeight, scrollX, scrollY }
}
