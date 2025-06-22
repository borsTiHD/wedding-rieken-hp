import type { ImageMode } from '@@/shared/types/ImageMode'
import checkUser from '@@/server/lib/checkUser'
import { getMediumPath, getOriginalPath, getThumbnailPath, getUserPath } from '@@/server/lib/filesHelper'
import getUser from '@@/server/lib/getUser'
import { downloadFile } from '@@/server/lib/sftpHelper'

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

  // Ensure params exist
  const params = event.context.params
  if (!params || !params.id) {
    throw createError({ statusCode: 400, statusMessage: 'No id provided' })
  }

  // Get id from params
  const id = params.id
  const decodedFileName = decodeURIComponent(id)

  // Check which mode the user requested
  const mode = getQuery(event).mode as ImageMode || 'thumbnail'

  function getPathByMode(mode: ImageMode, fileName: string): string {
    const userPath = getUserPath(user.uid)
    switch (mode) {
      case 'original':
        return getOriginalPath(userPath, fileName)
      case 'medium':
        return getMediumPath(userPath, fileName)
      case 'thumbnail':
      default:
        return getThumbnailPath(userPath, fileName)
    }
  }

  // Get the file path based on the requested mode
  const fullPath = getPathByMode(mode, decodedFileName)

  // Get file
  const imageBuffer = await downloadFile(fullPath).catch((error) => {
    if (error.message && error.message.includes('No such file')) {
      throw createError({ statusCode: 404, statusMessage: 'File not found' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to retrieve file' })
  })

  // // Content-Type anhand der Dateiendung setzen (hier JPEG als Beispiel)
  // res.set('Content-Type', 'image/jpeg')
  // res.send(imageBuffer)

  setResponseHeader(event, 'Content-Type', 'image/jpeg')
  return imageBuffer
})
