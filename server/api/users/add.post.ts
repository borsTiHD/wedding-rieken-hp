import { auth, db } from '@@/server/lib/firebaseAdmin'
import checkAdmin from '@@/server/lib/checkAdmin'
import type { UserProfile } from '@/types/UserProfile'

export default defineEventHandler(async(event) => {
    // Check if user is admin
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
    const newUserProfile: UserProfile = {
        role,
        email,
        phoneNumber: '',
        invitation: 'pending',
        additionalGuests: 0
    }

    // Add user profile to users collection
    await db.collection('users').doc(newUser.uid).set(newUserProfile).catch((error) => {
        throw createError({
            statusMessage: error.message
        })
    })

    // Return new user
    return { result: newUser }
})
