import { defineStore } from 'pinia'
import { MenuItem } from 'primevue/menuitem'

export const usePagesStore = defineStore('pages-store', () => {
    // Localisation
    const { t } = useI18n()
    const localePath = useLocalePath()

    // Pages for the navigation bar
    const pages = computed<MenuItem[]>(() => [
        { name: t('pages.home'), path: localePath('/') },
        { name: t('pages.login'), path: localePath('/login') },
        { name: t('pages.register'), path: localePath('/register')  },
        { name: t('pages.user'), path: localePath('/user') },
        { name: t('pages.profile'), path: localePath('/user/profile') },
        { name: t('pages.admin'), path: localePath('/admin') }
    ])

    return { pages }
})
