// @ts-check
type EventName = string

/**
 * Replacement for the Vue 2-based EventBus.
 * Stackoverflow: https://stackoverflow.com/questions/63471824/vue-js-3-event-bus/72376589#72376589
 * Edited by borstihd
 */
class Bus {
    eventListeners: Map<EventName, Array<{ callback: () => void, once: boolean }>>

    constructor() {
        this.eventListeners = new Map()
    }

    /**
     * @param {EventName} eventName
     * @param {Function} callback
     * @param {boolean} [once]
     * @private
     */
    registerEventListener(eventName: EventName, callback: () => void, once = false) {
        if (!this.eventListeners.has(eventName)) { this.eventListeners.set(eventName, []) } // Create EventListener if it doesn't exist

        const eventListeners = this.eventListeners.get(eventName)
        if (eventListeners) { eventListeners.push({ callback, once }) }
        // Else: Throw error?
    }

    /**
     * See: https://v2.vuejs.org/v2/api/#vm-on
     *
     * @param {EventName} eventName
     * @param {Function} callback
     */
    $on(eventName: EventName, callback: () => void) {
        this.registerEventListener(eventName, callback)
    }

    /**
     * See: https://v2.vuejs.org/v2/api/#vm-once
     *
     * @param {EventName} eventName
     * @param {Function} callback
     */
    $once(eventName: EventName, callback: () => void) {
        const once = true
        this.registerEventListener(eventName, callback, once)
    }

    /**
     * Removes all event listeners for the given event name or names.
     *
     * When provided with a callback function, removes only event listeners matching the provided function.
     *
     * See: https://v2.vuejs.org/v2/api/#vm-off
     *
     * @param {EventName | EventName[]} eventNameOrNames
     * @param {Function} [callback]
     */
    $off(eventNameOrNames: EventName | EventName[], callback = undefined) {
        const eventNames = Array.isArray(eventNameOrNames) ? eventNameOrNames : [eventNameOrNames]
        for (const eventName of eventNames) {
            const eventListeners = this.eventListeners.get(eventName)
            if (eventListeners === undefined) { continue }
            if (typeof callback === 'function') {
                for (let i = eventListeners.length - 1; i >= 0; i--) {
                    if (eventListeners[i].callback === callback) { eventListeners.splice(i, 1) }
                }
            } else {
                this.eventListeners.delete(eventName)
            }
        }
    }

    /**
     * See: https://v2.vuejs.org/v2/api/#vm-emit
     *
     * @param {EventName} eventName
     * @param {any} args
     */
    $emit(eventName: EventName, ...args: unknown[]) {
        if (!this.eventListeners.has(eventName)) { return } // No EventListeners for this eventName - return
        const eventListeners = this.eventListeners.get(eventName)
        const eventListenerIndexesToDelete = []
        if (eventListeners) {
            for (const [eventListenerIndex, eventListener] of eventListeners.entries()) {
                eventListener.callback(...(args as []))
                if (eventListener.once) { eventListenerIndexesToDelete.push(eventListenerIndex) }
            }

            for (let i = eventListenerIndexesToDelete.length - 1; i >= 0; i--) {
                eventListeners.splice(eventListenerIndexesToDelete[i], 1)
            }
        }
        // Else: Throw error?
    }
}

// Export type of EventBus class
export type EventBusInterface = InstanceType<typeof Bus>

// Export EventBus as a nuxt 3 plugin
// Access with: const { $emitter } = useNuxtApp() - in a nuxt 3
export default defineNuxtPlugin(() => {
    const EventBus = new Bus()
    return {
        provide: {
            emitter: EventBus
        }
    }
})
