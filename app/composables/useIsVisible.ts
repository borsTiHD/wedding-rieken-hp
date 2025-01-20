export function useIsVisible(querySelector: string): { isVisible: Ref<boolean>, observedElement: Ref<Element | null>, observe: (element: Element | null) => void, unobserve: () => void } {
    // Check if SSR (server-side rendering)
    if (typeof window === 'undefined' || !window) {
        return {
            isVisible: ref(false),
            observedElement: ref(null),
            observe: () => { },
            unobserve: () => { }
        }
    }

    const isVisible: Ref<boolean> = ref(false)
    const observedElement: Ref<Element | null> = ref(null)

    const observer: IntersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible.value = entry?.isIntersecting ?? false
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
