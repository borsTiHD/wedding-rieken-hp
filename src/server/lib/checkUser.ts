import { auth } from '@/server/lib/firebaseAdmin'
import type { H3Event } from 'h3'

export default async function checkUser(event: H3Event) {
    const idToken = getCookie(event, 'user-id-token')
    if (!idToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'You must be signed in to access.'
        })
    }

    // Verify ID token
    const decodedToken = await auth.verifyIdToken(idToken).catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // Check if user exists
    const user = await auth.getUser(decodedToken.uid).catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // If no user exists throw error
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'You must be signed in to access.'
        })
    }

    return true
}
