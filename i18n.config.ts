import de from './src/locales/de.json'
import us from './src/locales/us.json'

export default defineI18nConfig(() => ({
    legacy: false,
    globalInjection: true,
    fallbackLocale: 'de',
    messages: { de, us },
    datetimeFormats: {
        us: {
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
