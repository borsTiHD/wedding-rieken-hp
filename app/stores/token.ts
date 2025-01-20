import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token-store', () => {
  // Token data
  const token = ref<string | undefined>()

  // Get invitation token from store, url or localStorage
  function getInvitationToken() {
    const defaultToken = token.value

    // If token is already set in store, return it
    if (defaultToken && defaultToken !== '') {
      return defaultToken
    }

    // First check if token is in url
    // Get 'token' param from route
    const tokenFromUrl = useRoute().query.token as string
    if (tokenFromUrl) {
      token.value = tokenFromUrl
      setLocalStorage(tokenFromUrl)
      return tokenFromUrl
    }

    // If token is not in url, check localStorage
    // Can happen if the user already visited the page before with a token
    const tokenFromLocalStorage = getLocalStorage()
    token.value = tokenFromLocalStorage
    return token.value
  }

  // Set token in localStorage
  // TODO: Add cookie consent check for localStorage
  function setLocalStorage(tokenParam: string | undefined) {
    const newToken = tokenParam || token.value
    if (!newToken || newToken === '')
      return undefined

    const tokenLocalStorage = useStorage('invitation-token', newToken, localStorage, { mergeDefaults: true })
    tokenLocalStorage.value = newToken
    return tokenLocalStorage.value
  }

  // Get token from localStorage
  // TODO: Add cookie consent check for localStorage
  function getLocalStorage() {
    const tokenLocalStorage = useStorage('invitation-token', undefined, localStorage, { mergeDefaults: true })

    // If token is empty, delete entry from localStorage
    if (!tokenLocalStorage.value || tokenLocalStorage.value === '' || tokenLocalStorage.value === 'undefined') {
      deleteInvitationToken()
      return undefined
    }

    return tokenLocalStorage.value
  }

  // Delete invitation token from localStorage
  function deleteInvitationToken() {
    const tokenLocalStorage = useStorage('invitation-token', undefined, localStorage, { mergeDefaults: true })
    if (tokenLocalStorage.value !== undefined) {
      tokenLocalStorage.value = null
    }
    token.value = undefined
    return true
  }

  return { token, getInvitationToken, deleteInvitationToken, setLocalStorage }
})
