import type { AppContent } from './model'
import handleFirebaseError from '@/composables/handleFirebaseError'
import { useFirestore } from '@/composables/useFirestore'

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
