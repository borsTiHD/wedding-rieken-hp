import checkAdmin from '@@/server/lib/checkAdmin'
import { auth, db } from '@@/server/lib/firebaseAdmin'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  await checkAdmin(event)

  const { uid } = await readBody(event)

  // Check if uid is provided
  if (!uid) {
    throw createError({
      statusMessage: 'No user ID provided',
    })
  }

  // Check if user exists
  const user = await auth.getUser(uid).catch((error) => {
    throw createError({
      statusMessage: `Error fetching user: ${error.message}`,
    })
  })

  if (!user) {
    throw createError({
      statusMessage: 'User not found',
    })
  }

  // Delete user from Firebase Authentication
  await auth.deleteUser(uid).catch((error) => {
    throw createError({
      statusMessage: `Error deleting user: ${error.message}`,
    })
  })

  // Delete user profile from Firestore
  const userProfileRef = db.collection('users').doc(uid)
  await userProfileRef.delete().catch((error) => {
    throw createError({
      statusMessage: `Error deleting user: ${error.message}`,
    })
  })

  return { success: true, message: 'User deleted successfully' }
})
