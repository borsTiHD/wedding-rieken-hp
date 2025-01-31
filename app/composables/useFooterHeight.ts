import { useEventListener } from '@/composables/useEventListener'
import { useThrottleFn } from '@vueuse/core'
import { useRoute } from 'vue-router'

export function useFooterHeight(footer: Ref<HTMLElement | undefined>) {
  const interval = ref<null | ReturnType<typeof setInterval>>(null)
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

  function setHeight() {
    backgroundOverlayHeight.value = calculateHeight()
  }

  function setHeightInterval() {
    setHeight()
    if (interval.value) {
      clearInterval(interval.value)
    }
    interval.value = setInterval(() => {
      setHeight()
    }, 1000)
  }

  useEventListener(window, 'scroll', useThrottleFn(() => {
    setHeight()
  }, 10))

  const route = useRoute()
  watch(route, () => {
    setHeightInterval()
  })

  onMounted(() => {
    setHeightInterval()
  })

  return {
    backgroundOverlayHeight,
  }
}
