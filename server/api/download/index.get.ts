import checkUser from '@@/server/lib/checkUser'
import { downloadFile } from '@@/server/lib/minioApi'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await checkUser(event)

  // Get path from query
  const path = getQuery(event).path
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'No path provided' })
  }

  // Ensure path is a string
  if (typeof path !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path provided' })
  }

  return downloadFile(event, path)
})
