import { useI18n } from 'vue-i18n'

export default function useLocale() {
    const { locale, getLocaleCookie, setLocaleCookie, getBrowserLocale, setLocale } = useI18n()
    const browserLocale = getBrowserLocale()
    const cookieLocale = getLocaleCookie()

    // Set locale on startup
    if (cookieLocale) {
        setCookie(cookieLocale)
        setLocale(cookieLocale)
    } else if (browserLocale) {
        setCookie(browserLocale)
        setLocale(browserLocale)
    } else {
        setCookie('de')
        setLocale('de')
    }

    // Set locale on user interaction
    function setLanguage(newLocale: string) {
        setLocale(newLocale)
        setCookie(newLocale)
    }

    // Set locale on cookie
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
