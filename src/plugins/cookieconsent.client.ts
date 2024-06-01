import 'vanilla-cookieconsent/dist/cookieconsent.css'
import de from '@/locales/cookieconsent/de.json'
import us from '@/locales/cookieconsent/us.json'
import * as CookieConsent from 'vanilla-cookieconsent'
import type { CookieConsentConfig } from 'vanilla-cookieconsent'

const config: CookieConsentConfig = {
    onFirstConsent: () => {
        console.log('onFirstAction fired')
    },

    onConsent: () => {
        console.log('onConsent fired ...')
        const cookie = CookieConsent.getCookie()
        const preferences = CookieConsent.getUserPreferences()

        console.log('Cookie:', cookie)
        console.log('Preferences:', preferences)
    },

    onChange: () => {
        console.log('onChange fired ...')
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
            position: 'bottom right'
        },
        preferencesModal: {
            layout: 'box'
        }
    },

    // Categories
    categories: {
        necessary: {
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga|_gid)/
                    }
                ]
            }
        },
        firebase: {
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga|_gid)/
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

export default defineNuxtPlugin(async() => {
    await CookieConsent.run(config)

    return {
        provide: {
            CookieConsent: CookieConsent
        }
    }
})
