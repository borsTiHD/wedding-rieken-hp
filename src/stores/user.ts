import { defineStore } from 'pinia'
import { onAuthStateChanged, getIdToken, User} from 'firebase/auth'
import clearNestedObject from '@/composables/clearNestedObject'
import type { UserProfile } from '@/types/UserProfile'

export const useUserStore = defineStore('user-store', () => {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const { fetchAdditionalUserProfile } = useFirebaseUserProfile() // FirebaseUserProfile composable
    const { t } = useI18n() // Localisation

    // User data
    const user = reactive<User | Record<string, never>>({})
    const userProfile = reactive<UserProfile | Record<string, never>>({})

    // User data properties
    const uid = ref<string | null>(null)
    const displayName = ref<string | null>(null)
    const email = ref<string | null>(null)
    const emailVerified = ref<boolean | null>(null)
    const photoURL = ref<string | null>(null)

    // Fetch config data
    async function fetchUserData() {
        const cookie = useCookie('user-id-token')

        // This will update the user state when the user logs in or out
        onAuthStateChanged($auth, async(response) => {
            try {
                if (response) {
                    setUser(response) // Set user state
                    fetchUserProfile(response.uid) // Get additional userprofile data
                    const idToken = await getIdToken(response) // Get ID token
                    cookie.value = idToken // Set cookie with ID token
                } else {
                    setUser(null)
                    cookie.value = null
                }
            } catch (error) {
                console.error(error)
            }
        })

        // If the user is logged in, set the user state
        if ($auth.currentUser) {
            // Set user state
            setUser($auth.currentUser)

            // Get additional userprofile data
            await fetchUserProfile($auth.currentUser.uid).catch((error) => {
                console.error(error)
                throw new Error(error.message)
            })
        }
    }

    // Fetch user profile data
    async function fetchUserProfile(uid: string) {
        if (!uid) { throw new Error(t('firebase.custom.noUserId')) }

        // Get additional userprofile data
        const userData = await fetchAdditionalUserProfile(uid).catch((error) => {
            console.error(error)
            throw new Error(error.message)
        })

        // Throw error if no response
        if (!userData) { throw new Error(t('firebase.custom.profileNotFound')) }

        // Set user profile state
        setUserProfile(userData)
    }

    // Refresh user profile data
    const refreshUserProfile = async() => {
        // If the user is logged in, set the user state
        if ($auth.currentUser) {
            // Set user state
            setUser($auth.currentUser)

            // Get additional userprofile data
            await fetchUserProfile($auth.currentUser.uid)
        }
    }

    // Set user state
    const setUser = (newUser: User | null) => {
        // Clear all user states, on every change
        // That way we can be sure that no old data is left in the user state
        clearNestedObject(user)

        // Set new user state if newUser exists
        // This will leave the user state empty if no new newUser are passed
        if (newUser) {
            // replace all user state properties with the new newUser
            Object.assign(user, newUser)

            // Set user data properties
            uid.value = user.uid
            displayName.value = user.displayName
            email.value = user.email
            emailVerified.value = user.emailVerified
            photoURL.value = user.photoURL
        } else {
            // Set user data properties to null
            uid.value = null
            displayName.value = null
            email.value = null
            emailVerified.value = null
            photoURL.value = null
        }
    }

    // Set user profile state
    const setUserProfile = (newUserProfile: UserProfile | null) => {
        // Clear all userProfile states, on every change
        // That way we can be sure that no old data is left in the userProfile state
        clearNestedObject(userProfile)

        // Set new userProfile state if newUserProfile exists
        // This will leave the userProfile state empty if no new newUserProfile are passed
        if (newUserProfile) {
            // replace all userProfile state properties with the new newUserProfile
            Object.assign(userProfile, newUserProfile)
        }
    }

    return { user, userProfile, uid, displayName, email, emailVerified, photoURL, fetchUserData, setUser, setUserProfile, fetchUserProfile, refreshUserProfile }
})
