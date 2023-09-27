import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FirebaseError } from '@firebase/util'

export function useFirebaseStorage() {
    // From firebase.client.ts
    const { $storage } = useNuxtApp()

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

    return {
        uploadFile
    }
}
