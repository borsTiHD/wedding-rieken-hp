import { updateProfile } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'

export default function() {
    // From firebase.client.ts
    const { $auth } = useNuxtApp()

    // Set profile photo
    const setProfilePhotoUrl = async(photoUrl: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error('Kein Benutzer angemeldet.') }

        // Update profile photo
        await updateProfile(user, { photoURL: photoUrl }).catch((error: FirebaseError) => {
            console.error(error)
            throw new Error('Profilbild konnte nicht gespeichert werden.')
        })
        return true
    }

    return {
        setProfilePhotoUrl
    }
}
