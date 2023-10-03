import { updateProfile, updateEmail, updatePassword } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import type { UserProfile } from '@/types/UserProfile'

export default function() {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const { queryByCollectionAndId, deleteByCollectionAndId, addWithId } = useFirestore() // Firestore composable
    const { sendUserEmailVerification } = useFirebaseAuth() // Firebase auth composable

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
                // errorMessage = 'Du musst dich erneut anmelden, um diese Aktion auszuführen.'
                console.error(error)
                throw new Error(error.code)
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
                // errorMessage = 'Du musst dich erneut anmelden, um diese Aktion auszuführen.'
                console.error(error)
                throw new Error(error.code)
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // Send verification email
        await sendUserEmailVerification()

        // TODO: Need to change email in userprofile database as well

        return true
    }

    // Change display name
    const changeDisplayName = async(displayName: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error('Kein Benutzer angemeldet.') }

        // Update display name
        await updateProfile(user, { displayName }).catch((error: FirebaseError) => {
            let errorMessage = 'Der Anzeigename konnte nicht geändert werden.'

            // Handle specific errors
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Du musst dich erneut anmelden, um diese Aktion auszuführen.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

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
        const user = $auth.currentUser
        if (!user) { throw new Error('Kein Benutzer angemeldet.') }

        // Get current user email
        const email = user?.email

        // Create default user profile
        const defaultUserProfile = {
            role: 'guest',
            email: email ? email : '',
            confirmation: 'pending',
            additionalGuests: 0
        }

        // Add default user profile
        return addWithId('users', uid, defaultUserProfile)
    }

    // Delete user profile
    const deleteUserProfile = async(uid: string) => {
        return deleteByCollectionAndId(usersPath, uid)
    }

    // Get additional user profile data, stored in Firebase user collection
    const fetchAdditionalUserProfile = async(uid: string): Promise<UserProfile> => {
        if (!uid) { throw new Error('Keine Benutzer-ID angegeben') }

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
        }) as Promise<UserProfile>
    }

    // TODO: Add function to send password reset email to user
    // TODO: Add function to update (one or more) additional user profile data
    //          - Email
    //          - Confirmation: (Zusage/Absage)
    //          - Additional guests (numbers)
    //          - Role (only admins can do this)
    // TODO: Add function to delete user

    return {
        changePassword, // Firebase profile
        changeEmail, // Firebase profile
        changeDisplayName, // Firebase profile
        setProfilePhotoUrl, // Firebase profile
        fetchAdditionalUserProfile, // Additional user profile data
        createDefaultUserProfile, // Additional user profile data
        deleteUserProfile // Additional user profile data
    }
}
