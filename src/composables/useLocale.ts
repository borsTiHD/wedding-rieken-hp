import { useI18n } from 'vue-i18n'

export default function useLocale() {
    const { locale, getLocaleCookie, setLocaleCookie, getBrowserLocale, setLocale } = useI18n()
    const browserLocale = getBrowserLocale()
    const cookieLocale = getLocaleCookie()
    const { $CookieConsent } = useNuxtApp()

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
        $CookieConsent.setLanguage(newLocale)
    }

    // Set locale cookie
    // TODO: Add cookie consent check
    function setCookie(newLocale: string) {
        setLocaleCookie(newLocale)
    }

    return {
        locale,
        setLanguage,
        setCookie
    }
}
