import { useWindowSize } from '@/composables/useWindowSize'

// Composable determines the modal position based on the window size
export function useModalPosition() {
    const { windowWidth } = useWindowSize() // Window Size composable
    const isMobile = windowWidth.value < 640 // Mobile breakpoint

    // Computed propertie for the modal position
    const modalPosition = computed<'center' | 'top'>(() => {
        if (isMobile) return 'top'
        return 'center'
    })

    return { modalPosition }
}
