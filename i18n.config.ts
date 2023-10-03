import de from './src/locales/de.json'
import en from './src/locales/en.json'

export default defineI18nConfig(() => ({
    legacy: false,
    globalInjection: true,
    fallbackLocale: 'en',
    messages: { de, en }
}))
