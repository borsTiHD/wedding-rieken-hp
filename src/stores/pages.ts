import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { MenuItem } from 'primevue/menuitem'

export const usePagesStore = defineStore('pages-store', () => {
    // Localisation
    const { t } = useI18n()
    const localePath = useLocalePath()

    // User store
    const userStore = useUserStore()
    const uid = computed(() => userStore.uid)
    const userProfile = computed(() => userStore.userProfile)

    // Pages for the navigation bar
    const pages = computed<MenuItem[]>(() => {
        const pages = [
            { name: t('pages.home'), path: localePath('/') }
        ]

        // If the user is logged in
        if (uid.value) {
            pages.push(
                { name: t('pages.user'), path: localePath('/user') }
            )
        }

        // If the user is not logged in add the login and register pages
        if (!uid.value) {
            pages.push(
                { name: t('pages.login'), path: localePath('/login') }
                // { name: t('pages.register'), path: localePath('/register')  }
            )
        }

        // If the logged in user is an admin add the admin pages
        if (uid.value && userProfile.value && userProfile.value.role === 'admin') {
            pages.push(
                { name: t('pages.admin'), path: localePath('/admin') },
                { name: t('pages.user-management'), path: localePath('/admin/user-management') }
            )
        }

        return pages
    })

    return { pages }
})
