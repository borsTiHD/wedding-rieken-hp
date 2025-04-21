import checkAdmin from '@@/server/lib/checkAdmin'
import { deleteFile } from '@@/server/lib/minioApi'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  await checkAdmin(event)

  // Ensure params exist
  const params = event.context.params
  if (!params || !params.id) {
    throw createError({ statusCode: 400, statusMessage: 'No id provided' })
  }

  // Get id from params
  const id = params.id

  // Delete file from Minio
  const decodedPath = decodeURIComponent(id)

  await deleteFile(decodedPath).catch((error: { statusMessage: string }) => {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: error.statusMessage })
  })

  // Return
  return {
    statusCode: 200,
    statusMessage: 'File deleted successfully',
    success: true,
  }
})
