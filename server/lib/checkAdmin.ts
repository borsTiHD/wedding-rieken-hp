import { auth, db } from '@@/server/lib/firebaseAdmin'
import type { H3Event } from 'h3'

export default async function checkAdmin(event: H3Event) {
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
            statusCode: 401,
            statusMessage: error.message
        })
    })

    // Check if user exists
    const user = await auth.getUser(decodedToken.uid).catch((error) => {
        throw createError({
            statusCode: 404,
            statusMessage: error.message
        })
    })

    // Get user profile under /users/{userId}
    const userDoc = await db.collection('users').doc(user.uid).get().catch((error) => {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    })

    // Check if user profile exists and if role is admin
    const userProfile = userDoc.data()
    if (!userProfile || userProfile.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'You must be an admin to access.'
        })
    }

    return true
}
