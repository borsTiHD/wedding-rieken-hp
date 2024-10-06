import { queryByCollection, queryByCollectionAndId } from '@/server/lib/firestore'

export default defineEventHandler(async(event) => {
    try {
        const query = getQuery(event)

        // If no collection is specified, return error
        if (!query.col) {
            return { error: 'No collection specified' }
        }

        // If collection is specified, but no id, return all documents from collection
        if (!query.id) {
            const docs = await queryByCollection(query.col as string)
            return { result: docs }
        }

        // If collection and id is specified, return document from collection
        const doc = await queryByCollectionAndId(query.col as string, query.id as string)
        return { result: doc }
    } catch (error) {
        return { error: (error as Error)?.message }
    }
})
