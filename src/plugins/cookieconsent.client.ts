import 'vanilla-cookieconsent/dist/cookieconsent.css'
import de from '@/locales/cookieconsent/de.json'
import us from '@/locales/cookieconsent/us.json'
import { useCookieStore } from '@/stores/cookieconsent'
import * as CookieConsent from 'vanilla-cookieconsent'
import type { CookieConsentConfig } from 'vanilla-cookieconsent'

export default defineNuxtPlugin(async() => {
    // Create the cookie store
    const cookieStore = useCookieStore()

    const config: CookieConsentConfig = {
        // Will be called after the user has given first consent (accept/reject)
        onFirstConsent: () => {
            // Update the cookie store
            cookieStore.cookie = CookieConsent.getCookie()
            cookieStore.preferences = CookieConsent.getUserPreferences()
        },

        // Will be called after the user has given consent
        // just like 'onFirstConsent', but also on every subsequent page load
        onConsent: () => {
            // Update the cookie store
            cookieStore.cookie = CookieConsent.getCookie()
            cookieStore.preferences = CookieConsent.getUserPreferences()

            // Check services
            const app = CookieConsent.acceptedCategory('app')
            const firebase = CookieConsent.acceptedCategory('firebase')
            console.log('App:', app)
            console.log('Firebase:', firebase)
        },

        // Will be called after the user has updated his preferences
        // and only if consent has already been provided
        onChange: () => {
            // Update the cookie store
            cookieStore.cookie = CookieConsent.getCookie()
            cookieStore.preferences = CookieConsent.getUserPreferences()

            // Check services
            const app = CookieConsent.acceptedCategory('app')
            const firebase = CookieConsent.acceptedCategory('firebase')
            console.log('App:', app)
            console.log('Firebase:', firebase)
        },

        // Options
        disablePageInteraction: true,
        cookie: {
            useLocalStorage: true
        },

        // GUI Options
        guiOptions: {
            consentModal: {
                layout: 'box',
                position: 'bottom right',
                equalWeightButtons: false
            },
            preferencesModal: {
                layout: 'box',
                equalWeightButtons: false
            }
        },

        // Categories
        categories: {
            app: {
                enabled: true,
                autoClear: {
                    cookies: [
                        { name: /^(i18n)/ }, // Match cookies starting with 'i18n'
                        { name: /^(token)/ } // Match cookies starting with 'token'
                    ]
                }
            },
            firebase: {
                enabled: true,
                autoClear: {
                    cookies: [
                        // TODO: Add cookies here - firebase
                        {
                            name: /^(_ga|_gid|firebase)/
                        }
                    ]
                }
            }
        },

        // Languages
        language: {
            default: 'de', // Default language
            autoDetect: 'browser', // Auto detect the browser language

            translations: {
                de: de,
                us: us,
                en: us
            }
        }
    }

    await CookieConsent.run(config)

    return {
        provide: {
            CookieConsent: CookieConsent,
            CookieConsentActions: {
                run: (newConfig?: CookieConsentConfig) => CookieConsent.run(newConfig ? newConfig : config), // Re-run the cookie consent
                reset: (eraseCookie?: boolean) => {
                    CookieConsent.reset(eraseCookie) // Reset the cookie consent and delete own cookies
                    window.location.reload() // Reload page to apply changes
                }
            }
        }
    }
})
