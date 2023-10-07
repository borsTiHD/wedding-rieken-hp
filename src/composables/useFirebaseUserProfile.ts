import { updateProfile, updateEmail, updatePassword, deleteUser } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import { useUserStore } from '@/stores/user'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { UserProfile, PartialUserProfile } from '@/types/UserProfile'

export default function() {
    const { $auth } = useNuxtApp() // From firebase.client.ts
    const { queryByCollectionAndId, deleteByCollectionAndId, updateByCollectionAndId, addByCollectionAndId } = useFirestore() // Firestore composable
    const { sendUserEmailVerification } = useFirebaseAuth() // Firebase auth composable
    const { deleteUserFolder } = useFirebaseStorage() // FirebaseStorage composable

    // User store
    const userStore = useUserStore()
    const { setUser, setUserProfile, refreshUserProfile } = userStore

    // Localisation
    const { t } = useI18n()

    // Firebase paths
    const usersPath = 'users'

    // Change password
    const changePassword = async(password: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Update password
        await updatePassword(user, password).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.passwordNotChanged')
            throw new Error(errorMessage)
        })

        return true
    }

    // Change email
    const changeEmail = async(email: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Update primary email
        await updateEmail(user, email).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.emailNotChanged')
            throw new Error(errorMessage)
        })

        // Send verification email
        await sendUserEmailVerification()

        // Update email in additional user profile data
        await changeAdditionalUserProfileData({ email })

        return true
    }

    // Change display name
    const changeDisplayName = async(displayName: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Update display name
        await updateProfile(user, { displayName }).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.nameNotChanged')
            throw new Error(errorMessage)
        })

        return true
    }

    // Set profile photo
    const setProfilePhotoUrl = async(photoUrl: string): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Update profile photo
        await updateProfile(user, { photoURL: photoUrl }).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.avatarNotChanged')
            throw new Error(errorMessage)
        })
        return true
    }

    // Create default user profile
    const createDefaultUserProfile = async(uid: string) => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Get current user email
        const email = user?.email

        // Create default user profile
        const defaultUserProfile: UserProfile = {
            role: 'guest',
            email: email ? email : '',
            phoneNumber: '',
            invitation: 'pending',
            additionalGuests: 0
        }

        // Add default user profile
        return addByCollectionAndId('users', uid, defaultUserProfile)
    }

    // Change one, or more additional user profile data
    const changeAdditionalUserProfileData = async(data: PartialUserProfile) => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Get user id
        const uid = user.uid

        // Update user profile
        await updateByCollectionAndId(usersPath, uid, data).catch((error) => {
            console.error(error)
            throw new Error(t('firebase.custom.profileNotChanged'))
        })

        // Refresh user profile
        await refreshUserProfile()

        return true
    }

    // Delete a user
    // - deletes the user account
    // - deletes the user profile
    // - deletes the user files
    const deleteUserAccount = async(): Promise<boolean> => {
        const user = $auth.currentUser
        if (!user) { throw new Error(t('firebase.custom.noUserLoggedIn')) }

        // Delete user profile
        const uid = user.uid
        await deleteUserProfile(uid).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.profileNotDeleted')
            throw new Error(errorMessage)
        })

        // Delete user files
        await deleteUserFolder(uid).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.filesNotDeleted')
            throw new Error(errorMessage)
        })

        // Delete user
        await deleteUser(user).catch((error: FirebaseError) => {
            const errorMessage = handleFirebaseError(error, 'firebase.custom.userNotDeleted')
            throw new Error(errorMessage)
        })

        // Clear user state
        setUser(null)
        setUserProfile(null)

        return true
    }

    // Delete user profile (additional user profile data)
    const deleteUserProfile = async(uid: string) => {
        return deleteByCollectionAndId(usersPath, uid)
    }

    // Get additional user profile data, stored in Firebase user collection
    const fetchAdditionalUserProfile = async(uid: string): Promise<UserProfile> => {
        if (!uid) { throw new Error(t('firebase.custom.noUserId')) }

        // Get user profile
        return queryByCollectionAndId(usersPath, uid).catch(async(error) => {
            console.error(error)
            // If the user profile does not exist, create it
            if (error.message === 'Document does not exist') {
                // Create default user profile
                await createDefaultUserProfile(uid)
                return queryByCollectionAndId(usersPath, uid).catch((error) => {
                    console.error(error)
                    throw new Error(t('firebase.custom.profileNotFound'))
                })
            }
            throw new Error(t('firebase.custom.profileNotFound'))
        }) as unknown as Promise<UserProfile>
    }

    return {
        changePassword, // Firebase profile
        changeEmail, // Firebase profile
        changeDisplayName, // Firebase profile
        setProfilePhotoUrl, // Firebase profile
        fetchAdditionalUserProfile, // Additional user profile data
        createDefaultUserProfile, // Additional user profile data
        changeAdditionalUserProfileData, // Additional user profile data
        deleteUserAccount // Delete user with all data (firebase profile, additional user profile data, files)
    }
}
