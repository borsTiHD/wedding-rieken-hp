import { defineStore } from 'pinia'

export const usePagesStore = defineStore('pages-store', () => {
    // Localisation
    const { t } = useI18n()

    // Pages for the navigation bar
    const pages = computed(() => [
        { name: t('pages.home'), path: '/' },
        { name: t('pages.login'), path: '/login' },
        { name: t('pages.register'), path: '/register' },
        { name: t('pages.user'), path: '/user' },
        { name: t('pages.profile'), path: '/user/profile' },
        { name: t('pages.admin'), path: '/admin' }
    ])

    return { pages }
})
