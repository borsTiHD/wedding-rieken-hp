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

  async function uploadFile(file: File, path?: string) {
    // Check if user is logged in
    if (!user.value) {
      throw new Error(t('firebase.custom.noUserLoggedIn'))
    }

    // Check if user is admin
    // This is not necessary, the API would throw an error if the user is no admin
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

  // Return functions
  return {
    uploadFile, // admin only: add uploadFile function
  }
}
