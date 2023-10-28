import {
    createUserWithEmailAndPassword,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    sendSignInLinkToEmail,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailLink,
    isSignInWithEmailLink,
    EmailAuthProvider
} from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import { useUserStore } from '@/stores/user'
import handleFirebaseError from '@/composables/handleFirebaseError'

export default function() {
    const { $auth } = useNuxtApp() // From firebase.client.ts

    // Localisation
    const { t } = useI18n()

    // User store
    const userStore = useUserStore()
    const { setUser, setUserProfile, fetchUserProfile } = userStore

    // Register a new user
    const registerUser = async(email: string, password: string): Promise<boolean> => {
        const userCreds = await createUserWithEmailAndPassword($auth, email, password).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.registrationFailed')
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            setUser(userCreds.user)
            await fetchUserProfile(userCreds.user.uid) // Fetch user profile data or create default profile
            return true
        }

        throw new Error(t('firebase.custom.registrationFailed'))
    }

    // Login a user
    const loginUser = async(email: string, password: string): Promise<boolean> => {
        const userCreds = await signInWithEmailAndPassword($auth, email, password).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.loginFailed')
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            // Set user state
            setUser(userCreds.user)
            await fetchUserProfile(userCreds.user.uid) // Fetch user profile data or create default profile
            return true
        }

        throw new Error(t('firebase.custom.loginFailed'))
    }

    // Send email for password reset
    const sendUserPasswordResetEmail = async(): Promise<boolean> => {
        const email = $auth.currentUser?.email
        if (!email) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Send password reset email
        await sendPasswordResetEmail($auth, email).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.resetMailCouldNotSend')
            throw new Error(errorMessage)
        })

        return true
    }

    // Re-authenticate a user
    const reauthenticateUser = async(password: string): Promise<boolean> => {
        const email = $auth.currentUser?.email
        if (!email) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Create credential
        const credential = EmailAuthProvider.credential(email, password)

        // Re-authenticate user
        await reauthenticateWithCredential($auth.currentUser, credential).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.authFailed')
            throw new Error(errorMessage)
        })

        return true
    }

    // Send email verification
    const sendUserEmailVerification = async(): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Send verification email
        await sendEmailVerification(user).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.resetMailCouldNotSend')
            throw new Error(errorMessage)
        })

        return true
    }

    // Send email link to login
    const sendEmailLink = async(email: string): Promise<boolean> => {
        // Create url for email link
        const baseUrl = window.location.origin
        const url = `${baseUrl}/login/?tab=email`

        // Action code settings - see https://firebase.google.com/docs/auth/web/email-link-auth#handle_the_sign-in_link
        const actionCodeSettings = {
            // URL you want to redirect back to.
            // TODO: The domain (www.example.com) for this URL must be whitelisted in the Firebase Console.
            url: url,
            handleCodeInApp: true // This must be true
        }

        // Check if url is set
        if (actionCodeSettings.url === 'no-url-set') {
            throw new Error(t('firebase.custom.loginFailedInvalidUrl'))
        }

        // Send sign in link to email
        await sendSignInLinkToEmail($auth, email, actionCodeSettings).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.loginFailed')
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
            throw new Error(t('firebase.custom.loginFailedInvalidLink'))
        }

        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        // If not, the user will need to enter the email manually for verification.
        let email = window.localStorage.getItem('emailForSignIn')
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again.
            email = window.prompt(t('firebase.custom.confirmMailAddress'))
            if (!email) {
                throw new Error(t('firebase.custom.noMailProvided'))
            }
        }

        // Login with link - The client SDK will parse the code from the link for you
        const userCreds = await signInWithEmailLink($auth, email, url).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.loginFailed')
            throw new Error(errorMessage)
        })

        // If the user is logged in, set the user state
        if (userCreds) {
            // Clear email from storage
            window.localStorage.removeItem('emailForSignIn')

            // Set user state
            setUser(userCreds.user)
            await fetchUserProfile(userCreds.user.uid) // Fetch user profile data or create default profile

            return true
        }

        throw new Error(t('firebase.custom.loginFailed'))
    }

    // Logout a user
    const logoutUser = async(): Promise<void> => {
        await $auth.signOut().catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.logoutFailed')
            throw new Error(errorMessage)
        })
        setUser(null)
        setUserProfile(null)
    }

    return {
        registerUser,
        loginUser,
        reauthenticateUser,
        sendEmailLink,
        sendUserEmailVerification,
        sendUserPasswordResetEmail,
        loginWithEmailLink,
        logoutUser
    }
}
