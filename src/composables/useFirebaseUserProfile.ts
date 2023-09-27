import { updateProfile, updateEmail, sendEmailVerification, updatePassword } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'

export default function() {
    // From firebase.client.ts
    const { $auth } = useNuxtApp()
    const { queryByCollectionAndId, addWithId } = useFirestore() // Firestore composable

    // Firebase paths
    const usersPath = 'users'

    // Change password
    const changePassword = async(password: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error('Kein Benutzer angemeldet.') }

        // Update password
        await updatePassword(user, password).catch((error: FirebaseError) => {
            let errorMessage = 'Das Passwort konnte nicht geändert werden.'

            // Handle specific errors
            if (error.code === 'auth/weak-password') {
                errorMessage = 'Das Passwort ist zu schwach.'
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Du musst dich erneut anmelden, um diese Aktion auszuführen.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        return true
    }

    // Change email
    const changeEmail = async(email: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error('Kein Benutzer angemeldet.') }

        // Update primary email
        await updateEmail(user, email).catch((error: FirebaseError) => {
            let errorMessage = 'Die E-Mail-Adresse konnte nicht geändert werden.'

            // Handle specific errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet.'
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Die E-Mail-Adresse ist ungültig.'
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Du musst dich erneut anmelden, um diese Aktion auszuführen.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // Send verification email
        await sendEmailVerification(user).catch((error: FirebaseError) => {
            let errorMessage = 'Die verifizierungs E-Mail konnte nicht gesendet werden.'

            // Handle specific errors
            if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Du hast zu viele Anfragen gesendet. Bitte versuche es später erneut.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // TODO: Need to change email in userprofile database as well

        return true
    }

    // Set profile photo
    const setProfilePhotoUrl = async(photoUrl: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error('Kein Benutzer angemeldet.') }

        // Update profile photo
        await updateProfile(user, { photoURL: photoUrl }).catch((error: FirebaseError) => {
            let errorMessage = 'Das Profilfoto konnte nicht geändert werden.'

            // Handle specific errors
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Du musst dich erneut anmelden, um diese Aktion auszuführen.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })
        return true
    }

    // Create default user profile
    const createDefaultUserProfile = async(uid: string) => {
        // Get current user email
        const currentUser = $auth.currentUser
        const email = currentUser?.email

        // Create default user profile
        const defaultUserProfile = {
            role: 'guest',
            email: email ? email : ''
        }

        // Add default user profile
        await addWithId('users', uid, defaultUserProfile)
    }

    // Get additional user profile data, stored in Firebase user collection
    const getAdditionalUserProfile = async(uid: string) => {
        // Get user profile
        return queryByCollectionAndId(usersPath, uid).catch(async(error) => {
            // If the user profile does not exist, create it
            if (error.message === 'Document does not exist') {
                // Create default user profile
                await createDefaultUserProfile(uid)
                return queryByCollectionAndId(usersPath, uid).catch((error) => {
                    console.error(error)
                    throw new Error('Benutzerprofil konnte nicht geladen werden')
                })
            }
            console.error(error)
            throw new Error('Benutzerprofil konnte nicht geladen werden')
        })
    }

    return {
        changePassword, // Firebase profile
        changeEmail, // Firebase profile
        setProfilePhotoUrl, // Firebase profile
        getAdditionalUserProfile, // Additional user profile data
        createDefaultUserProfile // Additional user profile data
    }
}
