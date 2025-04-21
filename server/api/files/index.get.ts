import checkUser from '@@/server/lib/checkUser'
import { getAllFiles } from '@@/server/lib/minioApi'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await checkUser(event)

  // Get query parameters
  const query = getQuery(event)
  const path = query.path || ''

  // Get all files from Minio
  const files = await getAllFiles(path as string)

  // Return
  return {
    statusCode: 200,
    statusMessage: 'Files retrieved successfully',
    files,
    total: files?.length,
    success: true,
  }
})
