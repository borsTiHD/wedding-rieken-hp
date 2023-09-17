import { defineStore } from 'pinia'
import { onAuthStateChanged, User} from 'firebase/auth'
import { useFirestore } from '@/composables/useFirestore'
import type { UserProfile } from '@/types/UserProfile'

export const useUserStore = defineStore('user-store', () => {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const { queryByCollectionAndId, addWithId } = useFirestore() // Firestore composable

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
                await getUserProfile(user.value.uid)
            } else {
                user.value = null
            }
        })

        // If the user is logged in, set the user state
        if ($auth.currentUser) {
            // Set user state
            user.value = $auth.currentUser

            // Get additional userprofile data
            await getUserProfile(user.value.uid)
        }
    }

    // Fetch user profile data
    async function getUserProfile(uid: string) {
        // Get additional userprofile data
        const userData = await queryByCollectionAndId('users', uid).catch(async(error) => {
            // If the user profile does not exist, create it
            if (error.message === 'Document does not exist') {
                // Create default user profile
                await createDefaultUserProfile(uid)
                return await queryByCollectionAndId('users', uid).catch((error) => {
                    console.error(error)
                    throw new Error('Benutzerprofil konnte nicht geladen werden')
                })
            }
            console.error(error)
            throw new Error('Benutzerprofil konnte nicht geladen werden')
        })

        // Throw error if no response
        if (!userData) {
            throw new Error('Benutzerprofil nicht gefunden.')
        }

        // Set user profile state
        userProfile.value = userData as UserProfile
    }

    async function createDefaultUserProfile(uid: string) {
        // Create default user profile
        const defaultUserProfile = {
            name: ''
        }

        // Add default user profile
        await addWithId('users', uid, defaultUserProfile)
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
