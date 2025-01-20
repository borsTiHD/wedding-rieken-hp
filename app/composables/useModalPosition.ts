import { useWindowSize } from '@/composables/useWindowSize'

// Composable determines the modal position based on the window size
export function useModalPosition() {
  // Window Size composable with a big timer to prevent multiple calls
  // 1000 * 10 = 10 seconds
  const { windowWidth } = useWindowSize(1000 * 10)

  // Computed propertie for the modal position
  const modalPosition = computed<'center' | 'top'>(() => {
    const isMobile = windowWidth.value < 640 // Mobile breakpoint
    if (isMobile)
      return 'top'
    return 'center'
  })

  return { modalPosition }
}
