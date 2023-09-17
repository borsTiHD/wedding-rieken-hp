import { auth, db } from '@/server/lib/firebaseAdmin'
import checkAdmin from '@/server/lib/checkAdmin'

export default defineEventHandler(async(event) => {
    await checkAdmin(event)

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
