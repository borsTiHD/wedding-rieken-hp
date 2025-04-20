import { useUserStore } from '@/stores/user'

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

  async function getAllFiles(filePath: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    return $fetch(`${apiBaseUrl}/files`, {
      method: 'GET',
      params: { path: filePath },
    })
  }

  async function getPreviewUrl(fileId: string, thumbnail: boolean = false) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    const encodedPath = encodeURIComponent(fileId)

    return $fetch(`${apiBaseUrl}/files/${encodedPath}`, {
      method: 'GET',
      params: { thumbnail },
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
    getPreviewUrl,
    downloadFile,
    downloadFolder,
  }
}
