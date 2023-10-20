import { useUserStore } from '@/stores/user'
import type { PartialUserProfile } from '@/types/UserProfile'

export default function useBackendApi() {
    // Localisation
    const { $i18n } = useNuxtApp()
    const t = $i18n.t

    // User store
    const userStore = useUserStore()
    const user = computed(() => userStore.user)
    const userProfile = computed(() => userStore.userProfile)

    // Check guest and set the profile role
    // Only admins can set the role
    async function updateUserRole(uid: string, role: 'invited' | 'declined') {
        // Check if user is logged in
        if (!user.value) {
            throw new Error(t('firebase.custom.noUserLoggedIn'))
        }

        // Check if user is admin
        // This is not necessary, the API would throw an error if the user is no admin
        if (userProfile.value && userProfile.value.role !== 'admin') {
            throw new Error(t('admin.notAdminError'))
        }

        // Set invitation response
        const profile: PartialUserProfile = { role }

        // Send request to API to set new role
        return $fetch('/api/users/update', {
            method: 'POST',
            body: {
                uid,
                profile
            }
        })
    }

    return {
        updateUserRole
    }
}
