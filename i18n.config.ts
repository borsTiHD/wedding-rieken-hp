import de from './src/locales/de.json'
import en from './src/locales/en.json'

export default defineI18nConfig(() => ({
    legacy: false,
    globalInjection: true,
    fallbackLocale: 'en',
    messages: { de, en },
    datetimeFormats: {
        en: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }
        },
        de: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }
        }
    }
}))
