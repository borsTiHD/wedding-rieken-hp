import { useQuery } from '@tanstack/vue-query'
import { useFirestore } from '@/composables/useFirestore'
import handleFirebaseError from '@/composables/handleFirebaseError'
import type { Config } from '@/types/Config'

export function useConfigQuery() {
    const { t } = useI18n()
    const { queryByCollectionAndId } = useFirestore()

    return useQuery({
        queryKey: ['app', 'config'],
        queryFn: async() => {
            const response = await queryByCollectionAndId('app', 'config').catch((error) => {
                const errorMessage = handleFirebaseError(error, 'firebase.custom.appConfigNotFound')
                throw new Error(errorMessage)
            })

            if (!response) {
                throw new Error(t('firebase.custom.appConfigNotFound'))
            }

            return response as unknown as Config
        },
        staleTime: Number.POSITIVE_INFINITY
    })
}
