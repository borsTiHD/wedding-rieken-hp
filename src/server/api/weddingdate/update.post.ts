import { update } from '@/server/lib/firestore'

export default defineEventHandler(async(event) => {
    try {
        const { value } = getQuery(event)
        const timestamp = Number(value) // Convert to number

        // If timestamp is not a number, return error
        if (isNaN(timestamp)) {
            throw new Error('Invalid timestamp')
        }

        // Update wedding date
        const docRef = await update('app', 'config', 'weddingDate', timestamp)

        return { result: docRef }
    } catch (error: any) {
        return { error: error.message }
    }
})
