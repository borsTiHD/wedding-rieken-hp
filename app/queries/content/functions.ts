import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { AppContent } from './model'

export async function getContent(): Promise<AppContent> {
    const { queryByCollectionAndId } = useFirestore()

    const response = await queryByCollectionAndId('app', 'content').catch((error) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.appContentNotFound')
        throw new Error(errorMessage)
    })

    if (!response) {
        throw new Error('firebase.custom.appContentNotFound')
    }

    return response as AppContent
}
