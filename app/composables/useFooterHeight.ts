import { useEventListener } from '@/composables/useEventListener'
import { useThrottleFn } from '@vueuse/core'
import { useRoute } from 'vue-router'

export function useFooterHeight(footer: Ref<HTMLElement | undefined>) {
  const backgroundOverlayHeight = ref(0)

  function calculateHeight() {
    if (footer.value) {
      const rect = footer.value.getBoundingClientRect()
      const scrollPosition = window.innerHeight - rect.top

      // If the height is greater than 50,
      // reduce it by half the height of the footer
      if (scrollPosition > 50) {
        return scrollPosition - (rect.height / 2)
      }

      // If the height is greater than 0,
      // return the height
      return scrollPosition > 0 ? scrollPosition : 0
    }

    // If the footer is not set, show nothing
    return 0
  }

  useEventListener(window, 'scroll', useThrottleFn(() => {
    backgroundOverlayHeight.value = calculateHeight()
  }, 10))

  const route = useRoute()
  watch(route, () => {
    backgroundOverlayHeight.value = calculateHeight()
    setTimeout(() => {
      backgroundOverlayHeight.value = calculateHeight()
    }, 1000)
  })

  onMounted(() => {
    backgroundOverlayHeight.value = calculateHeight()
    setTimeout(() => {
      backgroundOverlayHeight.value = calculateHeight()
    }, 1000)
  })

  return {
    backgroundOverlayHeight,
  }
}
