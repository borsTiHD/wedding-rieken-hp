import { defineStore } from 'pinia'
import type { CookieValue, UserPreferences } from 'vanilla-cookieconsent'

export const useCookieStore = defineStore('cookie-consent-store', () => {
    // Reactive states
    const cookie = ref<CookieValue | undefined>()
    const preferences = ref<UserPreferences | undefined>()

    return { cookie, preferences }
})
