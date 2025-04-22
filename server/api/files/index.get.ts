import checkUser from '@@/server/lib/checkUser'
import { getAllFilesPaginated, getListAllFiles } from '@@/server/lib/minioApi'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await checkUser(event)

  // Get query parameters
  const query = getQuery(event)
  const path = query.path || ''

  const offset = Number(query.offset) || 0
  const limit = Number(query.limit) || 100

  // Get paginated files from Minio
  const files = await getAllFilesPaginated(path as string, offset, limit)

  const totalFiles = await getListAllFiles(path as string)

  // Return
  return {
    statusCode: 200,
    statusMessage: 'Files retrieved successfully',
    files,
    count: files?.length,
    total: totalFiles?.length,
    offset,
    limit,
    nextOffset: offset + limit,
    success: true,
  }
})
