import type { MinioFile } from '@@/shared/types/MinioFile'
import type { SerializeObject } from 'nitropack'
import { useUserStore } from '@/stores/user'

export type ImageMode = 'thumbnail' | 'medium' | 'original'

export default function useFileServerApi() {
  // Localisation
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  // Options
  const apiBaseUrl = '/api'

  // User store
  const userStore = useUserStore()
  const user = computed(() => userStore.user)
  const userProfile = computed(() => userStore.userProfile)

  async function getAllFiles(filePath: string, limit?: number): Promise<MinioFile[]> {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    let offset = 0
    let total = 0
    let allFiles: MinioFile[] = []

    do {
      const response = await $fetch(`${apiBaseUrl}/files`, {
        method: 'GET',
        params: { path: filePath, offset, limit: limit ? Math.min(limit - allFiles.length, 100) : 100 },
      })

      if (!response.success) {
        throw new Error(response.statusMessage || 'Failed to fetch files')
      }

      // Transform response.files to match MinioFile type
      const transformedFiles = response.files.map((file: SerializeObject<MinioFile>) => ({
        ...file,
        metadata: {
          ...file.metadata,
          lastModified: new Date(file.metadata.lastModified), // Convert metadata.lastModified to Date
        },
        file: 'name' in file.file // Check if file.file has a name property
          ? {
              ...file.file,
              lastModified: new Date(file.file.lastModified), // Convert lastModified to Date
            }
          : {
              prefix: file.file.prefix,
              lastModified: new Date(0), // Provide a fallback Date
            },
      })) as MinioFile[]

      // Append the transformed files to the allFiles array
      allFiles = allFiles.concat(transformedFiles)

      // Update the offset and total
      offset = response.nextOffset
      total = limit || response.total // Use the limit if provided, otherwise use the total from the response

      // Stop fetching if the limit is reached
      if (limit && allFiles.length >= limit) {
        allFiles = allFiles.slice(0, limit) // Ensure the result does not exceed the limit
        break
      }
    } while (allFiles.length < total)

    return allFiles
  }

  async function getAllFilesPaginated(filePath: string, offset: number, limit: number) { // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    return $fetch(`${apiBaseUrl}/files`, {
      method: 'GET',
      params: { path: filePath, offset, limit },
    })
  }

  async function getPreviewUrl(fileId: string, mode: ImageMode) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    const encodedPath = encodeURIComponent(fileId)

    return $fetch(`${apiBaseUrl}/files/${encodedPath}`, {
      method: 'GET',
      params: { mode },
    })
  }

  async function downloadFile(fileId: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    try {
      // Fetch the file as a Blob using $fetch
      const response = await $fetch.raw(`${apiBaseUrl}/download`, {
        method: 'GET',
        params: { path: fileId },
        responseType: 'blob', // Ensure the response is treated as a Blob
      })

      // Ensure the response contains a valid Blob
      if (!response._data || !(response._data instanceof Blob)) {
        throw new Error('Invalid file data received from the server')
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch?.[1] || 'downloaded-file'

      // Create a temporary link element
      const link = document.createElement('a')
      link.href = URL.createObjectURL(response._data) // Use the Blob from the response
      link.download = filename

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    }
    catch (error) {
      console.error('Error downloading file:', error)
      throw new Error('Failed to download file')
    }
  }

  async function downloadFolder(folderPath: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    try {
      // Fetch the folder as a Blob using $fetch
      const response = await $fetch.raw(`${apiBaseUrl}/download/folder`, {
        method: 'GET',
        params: { path: folderPath },
        responseType: 'blob', // Ensure the response is treated as a Blob
      })

      // Ensure the response contains a valid Blob
      if (!response._data || !(response._data instanceof Blob)) {
        throw new Error('Invalid folder data received from the server')
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch?.[1] || 'downloaded-folder.zip'

      // Create a temporary link element
      const link = document.createElement('a')
      link.href = URL.createObjectURL(response._data) // Use the Blob from the response
      link.download = filename

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    }
    catch (error) {
      console.error('Error downloading folder:', error)
      throw new Error('Failed to download folder')
    }
  }

  async function uploadFile(file: File, path?: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    // Check if user is admin
    if (userProfile.value && userProfile.value.role !== 'admin') {
      throw new Error(t('admin.notAdminError'))
    }

    const formData = new FormData()
    formData.append('file', file)

    // Add the path to the form data if provided
    if (path) {
      formData.append('path', path)
    }

    return $fetch(`${apiBaseUrl}/files`, {
      method: 'POST',
      body: formData,
    })
  }

  async function deleteFile(fileId: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    // Check if user is admin
    if (userProfile.value && userProfile.value.role !== 'admin') {
      throw new Error(t('admin.notAdminError'))
    }

    const encodedPath = encodeURIComponent(fileId)

    return $fetch(`${apiBaseUrl}/files/${encodedPath}`, {
      method: 'DELETE',
    })
  }

  // Return functions
  return {
    // admin only
    uploadFile,
    deleteFile,

    // all users
    getAllFiles,
    getAllFilesPaginated,
    getPreviewUrl,
    downloadFile,
    downloadFolder,
  }
}
