import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import { useUserStore } from '@/stores/user'
import type { UserProfile } from '@/types/UserProfile'

export default function() {
    // From firebase.client.ts
    const { $auth } = useNuxtApp()

    // User store
    const userStore = useUserStore()
    const { user, userProfile, setUser, setUserProfile } = userStore

    // Register a new user
    const registerUser = async(email: string, password: string): Promise<boolean> => {
        const userCreds = await createUserWithEmailAndPassword($auth, email, password).catch((error: FirebaseError) => {
            let errorMessage = error.message

            // Handle specific errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Es existiert bereits ein Benutzer mit dieser E-Mail-Adresse.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Die E-Mail-Adresse ist ungültig.'
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Das Passwort ist zu schwach.'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Zu viele Anfragen. Bitte versuche es später erneut.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            setUser(userCreds.user)
            return true
        }

        throw new Error('Registrierung fehlgeschlagen - unbekannter Fehler.')
    }

    // Login a user
    const loginUser = async(email: string, password: string): Promise<boolean> => {
        const userCreds = await signInWithEmailAndPassword($auth, email, password).catch((error: FirebaseError) => {
            let errorMessage = error.message

            // Handle specific errors
            if (error.code ==='auth/wrong-password') {
                errorMessage = 'Das Passwort ist falsch.'
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'Es existiert kein Benutzer mit dieser E-Mail-Adresse.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Die E-Mail-Adresse ist ungültig.'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Zu viele Anfragen. Bitte versuche es später erneut.'
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'Dieser Benutzer wurde deaktiviert.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            // Set user state
            setUser(userCreds.user)

            // Firestore composable
            const { queryByCollectionAndId } = useFirestore()

            // Get additional userprofile data
            const userData = await queryByCollectionAndId('users', userCreds.user.uid)
            if (!userData) {
                throw new Error('Benutzerprofil nicht gefunden.')
            }

            // Set user profile state
            setUserProfile(userData as UserProfile)

            return true
        }

        throw new Error('Login fehlgeschlagen - unbekannter Fehler.')
    }

    // Logout a user
    const logoutUser = async(): Promise<void> => {
        await $auth.signOut().catch((error: FirebaseError) => {
            console.error(error)
            throw new Error('Logout fehlgeschlagen - unbekannter Fehler.')
        })
        setUser(null)
    }

    return {
        user,
        userProfile,
        registerUser,
        loginUser,
        logoutUser
    }
}
