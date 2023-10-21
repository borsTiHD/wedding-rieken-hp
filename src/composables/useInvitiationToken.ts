import { useStorage } from '@vueuse/core'

export default function() {
    // Get invitation token from url or localStorage
    function getInvitiationToken() {
        const defaultToken = ''

        // First check if token is in url
        // Get 'token' param from route
        const tokenFromUrl = useRoute().query.token as string
        if (tokenFromUrl) {
            const tokenLocalStorage = useStorage('invitation-token', tokenFromUrl, localStorage, { mergeDefaults: true })
            tokenLocalStorage.value = tokenFromUrl
            return tokenLocalStorage.value
        }

        // If token is not in url, check localStorage
        // Can happen if the user already visited the page before with a token
        const token = useStorage('invitation-token', defaultToken, localStorage, { mergeDefaults: true })
        return token.value
    }

    // Delete invitation token from localStorage
    function deleteInvitiationToken() {
        const token = useStorage('invitation-token', '', localStorage, { mergeDefaults: true })
        token.value = ''
        return true
    }

    return {
        getInvitiationToken,
        deleteInvitiationToken
    }
}


