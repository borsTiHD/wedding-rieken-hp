import checkUser from '@@/server/lib/checkUser'
import { getMetadata, getPreviewUrl } from '@@/server/lib/minioApi'

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

  // Get metadata from Minio
  const metadata = await getMetadata(decodedPath)

  // Check if the request is for a thumbnail
  const getThumbnail = getQuery(event).thumbnail === 'true'

  // Check if the request is for a medium size image
  const getMedium = getQuery(event).medium === 'true'

  // Get preview URL from Minio
  const previewUrl = await getPreviewUrl(decodedPath, getThumbnail, getMedium)
  if (!previewUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to get preview URL' })
  }

  // Return preview URL
  return {
    statusCode: 200,
    statusMessage: 'Preview URL retrieved successfully',
    previewUrl,
    file: {
      name: metadata?.metaData?.['original-filename'] as string,
      path: decodedPath,
      isThumbnail: getThumbnail,
      isMedium: getMedium,
      metadata,
    },
    success: true,
  }
})
