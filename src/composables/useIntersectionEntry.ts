type InterOptions = {
    root: Element | null,
    threshold: number
}

export default function useIntersectionEntry(): {
    observedElement: Ref<Element | null>,
    elementClass: Ref<string>,
    interOptions: Ref<InterOptions>,
    interCallback: (entries: IntersectionObserverEntry[]) => void,
    observer: IntersectionObserver
    } {
    const observedElement: Ref<Element | null> = ref(null)
    const elementClass: Ref<string> = ref('')

    const interOptions: Ref<InterOptions> = ref({
        root: null,
        threshold: 0.5
    })

    const interCallback = (entries: IntersectionObserverEntry[]): void => {
        const [entry] = entries
        if (entry?.isIntersecting) {
            observedElement.value?.classList.add(elementClass.value)
        } else {
            observedElement.value?.classList.remove(elementClass.value)
        }
    }

    const observer = new IntersectionObserver(interCallback, interOptions.value)

    return {
        observedElement,
        elementClass,
        interOptions,
        interCallback,
        observer
    }
}
