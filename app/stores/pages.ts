import type { MenuItem } from 'primevue/menuitem'
import { whitelistedRoles } from '@/composables/whitelistedRoles'
import { useUserStore } from '@/stores/user'
import { defineStore } from 'pinia'

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
    const pages: MenuItem[] = [
      { name: t('pages.home'), path: localePath('/') },
    ]

    // Check for normal user pages
    if (uid.value // User is logged in
      && userProfile.value // User profile is loaded
      && whitelistedRoles.includes(userProfile.value.role) // Checking allowed roles
      && userProfile.value.invitation !== 'declined' // User has not declined the invitation
    ) {
      pages.push(
        { name: t('pages.date'), to: { path: localePath('/'), hash: '#wedding' } },
        { name: t('pages.infos'), to: { path: localePath('/'), hash: '#infos' } },
        { name: t('pages.gallery'), to: { path: localePath('/gallery') } },
      )
    }

    // If the user is not logged in add the login and register pages
    if (!uid.value) {
      pages.push(
        { name: t('pages.login'), path: localePath('/login') },
        // { name: t('pages.register'), path: localePath('/register')  }
      )
    }

    // If the logged in user is an admin add the admin pages
    if (uid.value && userProfile.value && userProfile.value.role === 'admin') {
      pages.push(
        { name: t('pages.admin'), path: localePath('/admin') },
        { name: t('pages.user-management'), path: localePath('/admin/user-management') },
        { name: t('pages.file-management'), path: localePath('/admin/file-management') },
      )
    }

    // Push the imprint and privacy policy pages
    pages.push(
      { name: t('pages.imprint'), path: localePath('/imprint') },
    )

    return pages
  })

  return { pages }
})
