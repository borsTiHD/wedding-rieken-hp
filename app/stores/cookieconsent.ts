import type { CookieValue, UserPreferences } from 'vanilla-cookieconsent'
import { defineStore } from 'pinia'

export const useCookieStore = defineStore('cookie-consent-store', () => {
  const categories = ['app', 'firebase', 'spotify']
  const cookie = ref<CookieValue | undefined>()
  const preferences = ref<UserPreferences | undefined>()
  const redirectPath = ref<string | undefined>()

  return { categories, cookie, preferences, redirectPath }
})
