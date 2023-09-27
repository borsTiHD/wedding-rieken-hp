import { defineStore } from 'pinia'
import { onAuthStateChanged, getIdToken, User} from 'firebase/auth'
import { useFirestore } from '@/composables/useFirestore'
import clearNestedObject from '@/composables/clearNestedObject'
import type { UserProfile } from '@/types/UserProfile'

export const useUserStore = defineStore('user-store', () => {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const { queryByCollectionAndId, addWithId } = useFirestore() // Firestore composable

    // User data
    const user = reactive<User | Record<string, never>>({})
    const userProfile = reactive<UserProfile| Record<string, never>>({})

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
            if (response) {
                // Set user state
                setUser(response)

                // Get additional userprofile data
                await getUserProfile(user.uid)

                // Get ID token
                const idToken = await getIdToken(response).catch((error: { message: string }) => {
                    throw new Error(error.message)
                })

                // Set cookie with ID token
                cookie.value = idToken
            } else {
                setUser(null)
                cookie.value = null
            }
        })

        // If the user is logged in, set the user state
        if ($auth.currentUser) {
            // Set user state
            setUser($auth.currentUser)

            // Get additional userprofile data
            await getUserProfile(user.uid)
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
        setUserProfile(userData as UserProfile)
    }

    // Create default user profile
    async function createDefaultUserProfile(uid: string) {
        // Get current user email
        const currentUser = $auth.currentUser
        const email = currentUser?.email

        // Create default user profile
        const defaultUserProfile = {
            name: '',
            email: email ? email : ''
        }

        // Add default user profile
        await addWithId('users', uid, defaultUserProfile)
    }

    // Refresh user profile data
    const refreshUserProfile = async() => {
        // If the user is logged in, set the user state
        if ($auth.currentUser) {
            // Set user state
            setUser($auth.currentUser)

            // Get additional userprofile data
            await getUserProfile(user.uid)
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

    return { user, userProfile, uid, displayName, email, emailVerified, photoURL, fetchUserData, setUser, setUserProfile, getUserProfile, refreshUserProfile }
})
