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

  async function getPreviewUrl(fileId: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    const encodedPath = encodeURIComponent(fileId)

    return $fetch(`${apiBaseUrl}/files/${encodedPath}`, {
      method: 'GET',
    })
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
  }
}
