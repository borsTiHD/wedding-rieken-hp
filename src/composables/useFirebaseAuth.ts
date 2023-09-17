import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User} from 'firebase/auth'
import { FirebaseError } from '@firebase/util'

export default function() {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const user = useState<User | null>('user', () => null) // Create a reactive state for the user (nuxt)

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
            user.value = userCreds.user
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
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            user.value = userCreds.user
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
        user.value = null
    }

    // Listen to auth state changes
    // This will update the user state when the user logs in or out
    onAuthStateChanged($auth, (userCreds) => {
        if (userCreds) {
            user.value = userCreds
        } else {
            user.value = null
        }
    })

    return {
        user,
        registerUser,
        loginUser,
        logoutUser
    }
}
