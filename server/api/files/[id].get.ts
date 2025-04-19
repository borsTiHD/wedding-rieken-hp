import checkAdmin from '@@/server/lib/checkAdmin'
import { getPreviewUrl } from '@@/server/lib/minioApi'

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

  // Get preview URL from Minio
  const decodedPath = decodeURIComponent(id)
  const previewUrl = await getPreviewUrl(decodedPath)
  if (!previewUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to get preview URL' })
  }

  // Return
  return {
    statusCode: 200,
    statusMessage: 'Preview URL retrieved successfully',
    previewUrl,
    success: true,
  }
})
