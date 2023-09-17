import { auth, db } from '@/server/lib/firebaseAdmin'

export default defineEventHandler(async(event) => {
    const idToken = getCookie(event, 'user-id-token')
    if (!idToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'You must be signed in to access to resource.'
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

    // Get user profile under /users/{userId}
    const userDoc = await db.collection('users').doc(user.uid).get().catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // Check if user profile exists and if role is admin
    const userProfile = userDoc.data()
    if (!userProfile || userProfile.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'You must be an admin to access to resource.'
        })
    }

    // Add new user
    // body: {
    //     name: 'Test User',
    //     email: 'testuser@test.de',
    //     password: 'XXXX',
    //     role: 'user'
    // }
    const { name, email, password, role } = await readBody(event)
    const newUser = await auth.createUser({
        displayName: name,
        email,
        password
    }).catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // Add user profile
    const newUserProfile = { role }
    await db.collection('users').doc(newUser.uid).set(newUserProfile).catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // Return new user
    return { result: newUser }
})
