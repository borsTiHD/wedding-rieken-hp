import checkUser from '@@/server/lib/checkUser'
import { getAllFilesPaginated } from '@@/server/lib/filesApi'
import { getOriginalPath, getUserPath } from '@@/server/lib/filesHelper'
import getUser from '@@/server/lib/getUser'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await checkUser(event)

  const user = await getUser(event)
  if (!user || !user.uid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'You must be signed in to access.',
    })
  }

  // Set path for user files
  const userPath = getUserPath(user.uid)
  const origFilePath = getOriginalPath(userPath)

  // Get query parameters
  const query = getQuery(event)
  const offset = Number(query.offset) || 0
  const limit = Number(query.limit) || 100

  // Get paginated files from SFTP
  const result = await getAllFilesPaginated(origFilePath, offset, limit).catch((error) => {
    if (error.message && error.message.includes('No such file')) {
      return {
        files: [],
        totalFiles: 0,
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to retrieve files',
    })
  })

  // Return
  return {
    statusCode: 200,
    statusMessage: 'Files retrieved successfully',
    files: result.files,
    count: result.files?.length,
    total: result?.totalFiles,
    offset,
    limit,
    nextOffset: offset + limit,
    success: true,
  }
})
