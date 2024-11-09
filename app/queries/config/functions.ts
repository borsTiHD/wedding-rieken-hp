import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { Config } from './model'

export async function getConfig(): Promise<Config> {
    const { t } = useI18n()
    const { queryByCollectionAndId } = useFirestore()

    const response = await queryByCollectionAndId('app', 'config').catch((error) => {
        const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigNotFound')
        throw new Error(errorMessage)
    })

    if (!response) {
        throw new Error(t('firebase.custom.appConfigNotFound'))
    }

    return response as Config
}
