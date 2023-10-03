import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'
import { FirebaseError } from '@firebase/util'

export function useFirebaseStorage() {
    // From firebase.client.ts
    const { $storage } = useNuxtApp()

    // Firebase paths
    const usersPath = 'users'

    // TODO: Define security rules for storage in firebase

    // Upload a file
    const uploadFile = async(path: string, file: File): Promise<string> => {
        // Create a storage reference from our storage service
        const storageRef = ref($storage, path)

        // Upload file
        const snapshot = await uploadBytes(storageRef, file).catch((error: FirebaseError) => {
            let errorMessage = 'Die Datei konnte nicht hochgeladen werden.'

            // Handle specific errors
            if (error.code === 'storage/unauthorized') {
                errorMessage = 'Du hast keine Berechtigung, diese Datei hochzuladen.'
            } else if (error.code === 'storage/canceled') {
                errorMessage = 'Der Upload wurde abgebrochen.'
            } else if (error.code === 'storage/unknown') {
                errorMessage = 'Ein unbekannter Fehler ist aufgetreten.'
            }

            console.error(error)
            throw new Error(errorMessage)
        })

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref).catch((error: FirebaseError) => {
            console.error(error)
            throw new Error('Die Datei konnte nicht hochgeladen werden.')
        })

        return downloadURL
    }

    // Delete a file
    const deleteFile = async(path: string): Promise<boolean> => {
        // Create a storage reference from our storage service
        const storageRef = ref($storage, path)

        // Delete the file
        await deleteObject(storageRef).catch((error: FirebaseError) => {
            console.error(error)
            throw new Error('Die Datei konnte nicht gelöscht werden.')
        })

        return true
    }

    // Delete complete user folder
    const deleteUserFolder = async(uid: string): Promise<boolean> => {
        const path = `${usersPath}/${uid}`

        // Create a storage reference from our storage service
        const storageRef = ref($storage, path)

        // List all items in the folder
        const listResult = await listAll(storageRef)

        // Delete all items in the folder
        listResult.items.forEach(async(itemRef) => {
            await deleteObject(itemRef).catch((error: FirebaseError) => {
                console.error(error)
                throw new Error('Die Datei konnte nicht gelöscht werden.')
            })
        })

        return true
    }

    return {
        uploadFile,
        deleteFile,
        deleteUserFolder
    }
}
