import 'vanilla-cookieconsent/dist/cookieconsent.css'
import de from '@/locales/cookieconsent/de.json'
import us from '@/locales/cookieconsent/us.json'
import { useCookieStore } from '@/stores/cookieconsent'
import * as CookieConsent from 'vanilla-cookieconsent'
import type { CookieConsentConfig } from 'vanilla-cookieconsent'

export default defineNuxtPlugin(async() => {
    // Create the cookie store
    const cookieStore = useCookieStore()
    const categories = cookieStore.categories

    // Function to check if consent is accepted for all or specific categories
    function isConsentAccepted(categoryList: string[] = categories) {
        const acceptedCategories = categoryList.map((category) => CookieConsent?.acceptedCategory(category))
        const checkedConsent = acceptedCategories.every((category) => category)
        if (!checkedConsent) {
            console.warn('Cookie consent not accepted for all categories:', categoryList)
        }

        return checkedConsent
    }

    // Function to clear all cookies, local storage, session storage and indexedDB
    function clearAll() {
        console.log('Clearing all data')

        // Clear all cookies
        const cookies = document.cookie.split(';')
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=')
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }

        // Clear local storage except for the cookie consent cookie
        const keyToKeep = 'cc_cookie'
        const valueToKeep = localStorage.getItem(keyToKeep)
        localStorage.clear()
        if (valueToKeep !== null) {
            localStorage.setItem(keyToKeep, valueToKeep)
        }

        // Clear session storage
        sessionStorage.clear()

        // Clear indexedDB
        indexedDB.databases().then((databases) => {
            for (const database of databases) {
                if (database.name) {
                    indexedDB.deleteDatabase(database.name)
                }
            }
        })
    }

    // Clear only specific indexedDB databases
    function clearIndexedDB(databases: string[]) {
        indexedDB.databases().then((indexedDBs) => {
            for (const dbInfo of indexedDBs) {
                if (dbInfo.name && databases.includes(dbInfo.name)) {
                    indexedDB.deleteDatabase(dbInfo.name)
                }
            }
        })
    }

    // Clear only specific local storage keys
    function clearSpecificLocalStorageKeys(keys: string[]): void {
        keys.forEach((key) => {
            localStorage.removeItem(key)
        })
    }

    // Clear only specific session storage keys
    function clearSpecificSessionStorageKeys(keys: string[]): void {
        keys.forEach((key) => {
            sessionStorage.removeItem(key)
        })
    }

    // Clear only specific cookies
    function clearSpecificCookies(cookies: string[]): void {
        cookies.forEach((cookie) => {
            document.cookie = `${cookie}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
        })
    }

    // Check consent for app category
    function checkAppConsent() {
        const appConsent = isConsentAccepted(['app'])
        if (!appConsent) {
            console.log('App consent not accepted - ^clearing all app data')
            clearSpecificLocalStorageKeys(['token'])
            clearSpecificSessionStorageKeys(['token'])
            clearSpecificCookies(['i18n_redirected'])
        }

        return appConsent
    }

    // Check consent for firebase category
    function checkFirebaseConsent() {
        const firebaseConsent = isConsentAccepted(['firebase'])
        if (!firebaseConsent) {
            console.log('Firebase consent not accepted - clearing all firebase data')
            clearIndexedDB(['firebaseLocalStorageDb', 'firebase-heartbeat-database'])
            clearSpecificCookies(['user-id-token'])
        }

        return firebaseConsent
    }

    // Check consent for spotify category
    function checkSpotifyConsent() {
        const spotifyConsent = isConsentAccepted(['spotify'])
        if (!spotifyConsent) {
            console.log('Spotify consent not accepted')
        }

        return spotifyConsent
    }

    // Configuration for the cookie consent
    const config: CookieConsentConfig = {
        // Will be called after the user has given first consent (accept/reject)
        onFirstConsent: () => {
            // Update the cookie store
            cookieStore.cookie = CookieConsent.getCookie()
            cookieStore.preferences = CookieConsent.getUserPreferences()

            // Check individual consents - delete individual data if consent is not accepted
            // Also clear all data if consent is not accepted for all categories
            if (!checkFirebaseConsent() && !checkAppConsent() && !checkSpotifyConsent()) {
                clearAll()
            }
        },

        // Will be called after the user has given consent
        // just like 'onFirstConsent', but also on every subsequent page load
        onConsent: () => {
            // Update the cookie store
            cookieStore.cookie = CookieConsent.getCookie()
            cookieStore.preferences = CookieConsent.getUserPreferences()

            // Check individual consents - delete individual data if consent is not accepted
            // Also clear all data if consent is not accepted for all categories
            if (!checkFirebaseConsent() && !checkAppConsent() && !checkSpotifyConsent()) {
                clearAll()
            }
        },

        // Will be called after the user has updated his preferences
        // and only if consent has already been provided
        onChange: () => {
            // Update the cookie store
            cookieStore.cookie = CookieConsent.getCookie()
            cookieStore.preferences = CookieConsent.getUserPreferences()

            // Check individual consents - delete individual data if consent is not accepted
            // Also clear all data if consent is not accepted for all categories
            if (!checkFirebaseConsent() && !checkAppConsent() && !checkSpotifyConsent()) {
                clearAll()
            }
        },

        // Options
        disablePageInteraction: false,
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
                        {
                            name: /^(_ga|_gid|firebase|user-id-token)/
                        }
                    ]
                }
            },
            spotify: {
                enabled: true
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

    // Run the cookie consent with the configuration for the first time
    await CookieConsent.run(config)

    return {
        provide: {
            CookieConsent: CookieConsent,
            CookieConsentActions: {
                run: (newConfig?: CookieConsentConfig) => CookieConsent.run(newConfig ? newConfig : config), // Re-run the cookie consent
                reset: (eraseCookie?: boolean) => {
                    CookieConsent.reset(eraseCookie) // Reset the cookie consent and delete own cookies
                    window.location.reload() // Reload page to apply changes
                },
                isConsentAccepted
            }
        }
    }
})
