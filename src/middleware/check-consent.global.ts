import { useCookieStore } from '@/stores/cookieconsent'

export default defineNuxtRouteMiddleware((to) => {
    // Skip middleware on server
    if (import.meta.server) {
        return
    }

    // Check if path is '/consent' or '/imprint' and skip consent check
    if (['/consent', '/imprint'].includes(to.path)) {
        return
    }

    // Cookie consent
    // Check if cookie consent is accepted for 'app' and 'firebase' categories
    const cookieStore = useCookieStore()
    const cookieConsentAccepted = cookieStore?.preferences?.acceptedCategories.includes('app') && cookieStore?.preferences?.acceptedCategories.includes('firebase')
    if (!cookieConsentAccepted) {
        return navigateTo('/consent')
    }

    return
})
