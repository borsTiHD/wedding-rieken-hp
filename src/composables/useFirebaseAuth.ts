import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import { useUserStore } from '@/stores/user'

export default function() {
    // From firebase.client.ts
    const { $auth } = useNuxtApp()

    // User store
    const userStore = useUserStore()
    const { setUser, setUserProfile, getUserProfile } = userStore

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
            getUserProfile(userCreds.user.uid) // Fetch user profile data or create default profile
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
            getUserProfile(userCreds.user.uid) // Fetch user profile data or create default profile
            return true
        }

        throw new Error('Login fehlgeschlagen - unbekannter Fehler.')
    }

    // Send email link to login
    const sendEmailLink = async(email: string): Promise<boolean> => {
        const config = useRuntimeConfig()
        const { firebaseAuthEmailSigninUrl } = config.public // Set in nuxt.config.ts

        // Action code settings - see https://firebase.google.com/docs/auth/web/email-link-auth#handle_the_sign-in_link
        const actionCodeSettings = {
            // URL you want to redirect back to.
            // TODO: The domain (www.example.com) for this URL must be whitelisted in the Firebase Console.
            url: firebaseAuthEmailSigninUrl ? `${firebaseAuthEmailSigninUrl}?tab=email` : 'no-url-set',
            handleCodeInApp: true // This must be true
        }

        // Check if url is set
        if (actionCodeSettings.url === 'no-url-set') {
            throw new Error('Login fehlgeschlagen - ungültige URL.')
        }

        // Send sign in link to email
        await sendSignInLinkToEmail($auth, email, actionCodeSettings).catch((error: FirebaseError) => {
            let errorMessage = error.message

            // Handle specific errors
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Die E-Mail-Adresse ist ungültig.'
            } else if (error.code === 'auth/invalid-email-verified') {
                errorMessage = 'Die E-Mail-Adresse ist ungültig.'
            } else if (error.code === 'auth/invalid-action-code') {
                errorMessage = 'Der Link ist ungültig. Bitte probiere es erneut.'
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'Dieser Benutzer wurde deaktiviert.'
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Diese Aktion ist nicht erlaubt.'
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Zu viele Anfragen. Bitte versuche es später erneut.'
            } else if (error.code === 'auth/quota-exceeded') {
                errorMessage = 'Zu viele Anfragen. Bitte versuche es später erneut.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // The link was successfully sent
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email)

        return true
    }

    // Login with email link
    const loginWithEmailLink = async(): Promise<boolean> => {
        const url = window.location.href
        if (!isSignInWithEmailLink($auth, url)) {
            throw new Error('Login fehlgeschlagen - ungültiger Link.')
        }

        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        // If not, the user will need to enter the email manually for verification.
        let email = window.localStorage.getItem('emailForSignIn')
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again.
            email = window.prompt('Bitte geben Sie Ihre E-Mail-Adresse zur Bestätigung an')
            if (!email) {
                throw new Error('Login fehlgeschlagen - E-Mail-Adresse nicht angegeben.')
            }
        }

        // Login with link - The client SDK will parse the code from the link for you
        const userCreds = await signInWithEmailLink($auth, email, url).catch((error: FirebaseError) => {
            let errorMessage = error.message

            // Handle specific errors
            if (error.code === 'auth/expired-action-code') {
                errorMessage = 'Der Link ist abgelaufen. Bitte probiere es erneut.'
            } else if (error.code === 'auth/invalid-action-code') {
                errorMessage = 'Der Link ist ungültig. Bitte probiere es erneut.'
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'Dieser Benutzer wurde deaktiviert.'
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'Es existiert kein Benutzer mit dieser E-Mail-Adresse.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            // Clear email from storage
            window.localStorage.removeItem('emailForSignIn')

            // Set user state
            setUser(userCreds.user)
            getUserProfile(userCreds.user.uid) // Fetch user profile data or create default profile

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
        setUserProfile(null)
    }

    return {
        registerUser,
        loginUser,
        sendEmailLink,
        loginWithEmailLink,
        logoutUser
    }
}
