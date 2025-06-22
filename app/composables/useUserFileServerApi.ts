import type { ImageFile } from '@@/shared/types/ImageFile'
import type { ImageMode } from '@@/shared/types/ImageMode'
import type { SerializeObject } from 'nitropack'
import { useUserStore } from '@/stores/user'

export default function useUserFileServerApi() {
  // Localisation
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  // Options
  const apiBaseUrl = '/api'

  // User store
  const userStore = useUserStore()
  const user = computed(() => userStore.user)

  async function getAllFilesPaginated(offset: number, limit: number) { // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    return $fetch(`${apiBaseUrl}/user/files`, {
      method: 'GET',
      params: { offset, limit },
    })
  }

  async function getPreviewBuffer(fileId: string, mode: ImageMode) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    const encodedPath = encodeURIComponent(fileId)

    return $fetch(`${apiBaseUrl}/user/files/${encodedPath}`, {
      method: 'GET',
      params: { mode },
    })
  }

  async function uploadFile(file: File, path?: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    const formData = new FormData()
    formData.append('file', file)

    // Add the path to the form data if provided
    if (path) {
      formData.append('path', path)
    }

    return $fetch(`${apiBaseUrl}/user/files`, {
      method: 'POST',
      body: formData,
    })
  }

  async function deleteFile(fileId: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    const encodedPath = encodeURIComponent(fileId)

    console.log('Deleting file with ID:', encodedPath)

    return 'Not implemented yet'
    // return $fetch(`${apiBaseUrl}/user/files/${encodedPath}`, {
    //   method: 'DELETE',
    // })
  }

  // Return functions
  return {
    uploadFile,
    deleteFile, // TODO: Implement deleteFile

    getAllFilesPaginated,
    getPreviewBuffer,
  }
}
