import type { PartialUserProfile } from '@/types/UserProfile'
import checkUser from '@@/server/lib/checkUser'
import { db } from '@@/server/lib/firebaseAdmin'

export default defineEventHandler(async (event) => {
  // Check if user is logged in
  await checkUser(event)

  // Get data from request body
  // body: {
  //     uid: User ID of the user to update,
  //     token: string
  // }
  const { uid, token }: { uid: string, token: string } = await readBody(event)

  // Check if parameters are valid
  if (!uid || !token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid parameters',
    })
  }

  // Get token from database
  const response = await db.collection('app').doc('admin').get().catch((error) => {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Couldn\'t get data from database',
    })
  })

  // Compare tokens
  const inviteToken = response.data()?.inviteToken // Get invite token from database
  if (token !== inviteToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid token',
    })
  }

  // Get user profile from database
  const userDoc = await db.collection('users').doc(uid).get().catch(() => {
    // Do nothing
    return null
  })

  // Check if user profile exists and if role is admin
  const userProfile = userDoc?.data()
  if (userProfile && userProfile.role === 'admin') {
    return {
      result: 'success',
      message: 'User is already an admin - no doing',
    }
  }

  // Update user profile
  const profile: PartialUserProfile = { role: 'invited' }
  await db.collection('users').doc(uid).update(profile).catch((error) => {
    throw createError({
      statusMessage: error.message,
    })
  })

  // Return success message
  return { result: 'success' }
})
