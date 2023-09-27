import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'

export default function() {
    // From firebase.client.ts
    const { $auth } = useNuxtApp()

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

    return {
        changeEmail,
        setProfilePhotoUrl
    }
}
