import { useUserStore } from '@/stores/user'
import type { PartialUserProfile } from '@/types/UserProfile'

export default function useBackendApi() {
    // Localisation
    const { $i18n } = useNuxtApp()
    const t = $i18n.t

    // Options
    const apiBaseUrl = '/api'

    // User store
    const userStore = useUserStore()
    const user = computed(() => userStore.user)
    const userProfile = computed(() => userStore.userProfile)

    // Get list of all users
    // Only admins can get the list of all users
    async function getAllUsers() {
        // Check if user is logged in
        if (!user.value) {
            throw new Error(t('firebase.custom.noUserLoggedIn'))
        }

        // Check if user is admin
        // This is not necessary, the API would throw an error if the user is no admin
        if (userProfile.value && userProfile.value.role !== 'admin') {
            throw new Error(t('admin.notAdminError'))
        }

        // Get list of all users
        return $fetch(`${apiBaseUrl}/users`)
    }

    // Create a new user
    // Only admins can create new users
    async function createUser(name: string, email: string, password: string, role?: 'invited' | 'declined') {
        // Check if user is logged in
        if (!user.value) {
            throw new Error(t('firebase.custom.noUserLoggedIn'))
        }

        // Check if user is admin
        // This is not necessary, the API would throw an error if the user is no admin
        if (userProfile.value && userProfile.value.role !== 'admin') {
            throw new Error(t('admin.notAdminError'))
        }

        return $fetch(`${apiBaseUrl}/users/add`, {
            method: 'POST',
            body: {
                name,
                email,
                password,
                role: role ? role : 'invited'
            }
        })
    }

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
        return $fetch(`${apiBaseUrl}/users/update`, {
            method: 'POST',
            body: {
                uid,
                profile
            }
        })
    }

    // Update user profile role to invited
    // Needs a valid token, which is sent to the API and compared with the token in the database
    async function updateUserRoleToInvited(uid: string, token: string) {
        // Check if user is logged in
        if (!user.value) {
            throw new Error(t('firebase.custom.noUserLoggedIn'))
        }

        // Make API Call and update user role
        return $fetch(`${apiBaseUrl}/user/update-role`, {
            method: 'POST',
            body: {
                uid,
                token
            }
        })
    }

    // Return functions
    return {
        getAllUsers, // admin only
        createUser, // admin only
        updateUserRole, // admin only
        updateUserRoleToInvited // user only
    }
}
