import { defineStore } from 'pinia'
import { onAuthStateChanged, User} from 'firebase/auth'
import { useFirestore } from '@/composables/useFirestore'
import type { UserProfile } from '@/types/UserProfile'

export const useUserStore = defineStore('user-store', () => {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const { queryByCollectionAndId } = useFirestore() // Firestore composable

    // Config data
    const user = ref<User | null>()
    const userProfile = ref<UserProfile| null>()

    // Fetch config data
    async function fetchUserData() {
        // This will update the user state when the user logs in or out
        onAuthStateChanged($auth, async(response) => {
            if (response) {
                // Set user state
                user.value = response

                // Get additional userprofile data
                const userData = await queryByCollectionAndId('users', user.value.uid)
                if (!userData) {
                    throw new Error('Benutzerprofil nicht gefunden.')
                }

                // Set user profile state
                userProfile.value = userData as UserProfile
            } else {
                user.value = null
            }
        })

        // If the user is logged in, set the user state
        if ($auth.currentUser) {
            // Set user state
            user.value = $auth.currentUser

            // Get additional userprofile data
            const userData = await queryByCollectionAndId('users', user.value.uid)
            if (!userData) {
                throw new Error('Benutzerprofil nicht gefunden.')
            }

            // Set user profile state
            userProfile.value = userData as UserProfile
        }
    }

    // Set user state
    const setUser = (userCreds: User | null) => {
        user.value = userCreds
    }

    // Set user profile state
    const setUserProfile = (userProfileData: UserProfile | null) => {
        userProfile.value = userProfileData
    }

    return { user, userProfile, fetchUserData, setUser, setUserProfile }
})
