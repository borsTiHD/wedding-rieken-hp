export function useIsVisible(querySelector: string): { isVisible: Ref<boolean>, observedElement: Ref<Element | null>, observe: (element: Element | null) => void, unobserve: () => void } {
    const isVisible: Ref<boolean> = ref(false)
    const observedElement: Ref<Element | null> = ref(null)

    const observer: IntersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible.value = entry.isIntersecting
    })

    const observe = (element: Element | null) => {
        if (element) {
            observer.observe(element)
        }
    }

    const unobserve = () => {
        observer.disconnect()
    }

    onMounted(() => {
        observedElement.value = document.querySelector(querySelector)
        observe(observedElement.value)
    })

    onUnmounted(() => {
        unobserve()
    })

    return { isVisible, observedElement, observe, unobserve }
}
