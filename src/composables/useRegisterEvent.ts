// @ts-check
import { onMounted, onUnmounted } from 'vue'
import useEmitter from '@/composables/useEmitter'

// Helper to access the event bus '@/plugins/EventBus'
// Usage: import { useEmitter } from '@/composables/useEmitter' - for emitting events
// Usage: import { useRegisterEvent } from '@/composables/useRegisterEvent' - for listening to events
export function useRegisterEvent(eventName: string, callback: (e: Event) => void) {
    const emitter = useEmitter()
    onMounted(() => emitter.$on(eventName, callback))
    onUnmounted(() => emitter.$off(eventName, callback))
}
