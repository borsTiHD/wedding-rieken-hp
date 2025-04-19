import checkUser from '@@/server/lib/checkUser'
import { getPreviewUrl } from '@@/server/lib/minioApi'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await checkUser(event)

  // Ensure params exist
  const params = event.context.params
  if (!params || !params.id) {
    throw createError({ statusCode: 400, statusMessage: 'No id provided' })
  }

  // Get id from params
  const id = params.id
  const decodedPath = decodeURIComponent(id)

  // Check if the request is for a preview
  const isPreview = getQuery(event).preview === 'true';

  // Get preview URL from Minio
  const previewUrl = await getPreviewUrl(decodedPath, isPreview)
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
