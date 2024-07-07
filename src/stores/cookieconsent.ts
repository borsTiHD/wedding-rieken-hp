import { defineStore } from 'pinia'
import type { CookieValue, UserPreferences } from 'vanilla-cookieconsent'

export const useCookieStore = defineStore('cookie-consent-store', () => {
    const categories = ['app', 'firebase', 'spotify']
    const cookie = ref<CookieValue | undefined>()
    const preferences = ref<UserPreferences | undefined>()
    const redirectPath = ref<string | undefined>()

    return { categories, cookie, preferences, redirectPath }
})
