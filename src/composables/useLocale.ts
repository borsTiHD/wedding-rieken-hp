import { useI18n } from 'vue-i18n'

export default function useLocale() {
    const { locale, getLocaleCookie, setLocaleCookie, getBrowserLocale, setLocale } = useI18n()
    const browserLocale = getBrowserLocale()
    const cookieLocale = getLocaleCookie()
    const { $CookieConsent, $CookieConsentActions } = useNuxtApp()

    // Set locale on startup
    if (cookieLocale) {
        setLanguage(cookieLocale)
    } else if (browserLocale) {
        setLanguage(browserLocale)
    } else {
        setLanguage('de')
    }

    // Set locale
    function setLanguage(newLocale: string) {
        setLocale(newLocale)
        setCookie(newLocale)

        // Set language in cookie consent
        // Timeout is needed to wait for the cookie consent to be initialized
        setTimeout(() => {
            if ($CookieConsent) $CookieConsent.setLanguage(newLocale)
        }, 0)
    }

    // Set locale cookie
    function setCookie(newLocale: string) {
        if (!$CookieConsentActions?.consentCheck(['app'])) return null
        setLocaleCookie(newLocale)
    }

    return {
        locale,
        setLanguage,
        setCookie
    }
}
