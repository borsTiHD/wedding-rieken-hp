import type { FirebaseError } from 'firebase/app'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'

export function useFirebaseStorage() {
  // From firebase.client.ts
  const { $storage } = useNuxtApp()

  // Localisation
  const { t } = useI18n()

  // Firebase paths
  const usersPath = 'users'

  // Upload a file
  const uploadFile = async (path: string, file: File): Promise<string> => {
    // Create a storage reference from our storage service
    const storageRef = ref($storage, path)

    // Upload file
    const snapshot = await uploadBytes(storageRef, file).catch((error: FirebaseError) => {
      const errorMessage = handleFirebaseError(error, 'firebase.custom.fileNotUploaded')
      throw new Error(errorMessage)
    })

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref).catch((error: FirebaseError) => {
      console.error(error)
      throw new Error(t('firebase.custom.fileNotUploaded'))
    })

    return downloadURL
  }

  // Get file URL
  const getFileUrl = async (path: string): Promise<string> => {
    // Create a storage reference from our storage service
    const storageRef = ref($storage, path)

    // Get file URL
    const downloadURL = await getDownloadURL(storageRef).catch((error: FirebaseError) => {
      const errorMessage = handleFirebaseError(error, 'firebase.custom.fileNotFound')
      throw new Error(errorMessage)
    })

    return downloadURL
  }

  // Delete a file
  const deleteFile = async (path: string): Promise<boolean> => {
    // Create a storage reference from our storage service
    const storageRef = ref($storage, path)

    // Delete the file
    await deleteObject(storageRef).catch((error: FirebaseError) => {
      const errorMessage = handleFirebaseError(error, 'firebase.custom.fileNotDeleted')
      throw new Error(errorMessage)
    })

    return true
  }

  // Delete complete user folder
  const deleteUserFolder = async (uid: string): Promise<boolean> => {
    const path = `${usersPath}/${uid}`

    // Create a storage reference from our storage service
    const storageRef = ref($storage, path)

    // List all items in the folder
    const listResult = await listAll(storageRef)

    // Delete all items in the folder
    listResult.items.forEach(async (itemRef) => {
      await deleteObject(itemRef).catch((error: FirebaseError) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.fileNotDeleted')
        throw new Error(errorMessage)
      })
    })

    return true
  }

  return {
    uploadFile,
    getFileUrl,
    deleteFile,
    deleteUserFolder,
  }
}
