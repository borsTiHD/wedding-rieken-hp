import { randomUUID } from 'node:crypto'
import checkUser from '@@/server/lib/checkUser'
import { uploadFile } from '@@/server/lib/filesApi'
import getUser from '@@/server/lib/getUser'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await checkUser(event)

  const user = await getUser(event)

  // Form data to get uploaded file
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
  }

  // Set path for user files
  const userPath = `/user/${user.uid}`

  // Get file from form data
  const file = formData.find(field => field?.name === 'file' && field?.type && field?.data && field?.data?.length > 0 && field?.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file found in form data' })
  }

  // Get file information
  const fileName = file.filename || `${randomUUID()}` // Original file name
  const mimeType = file.type // MIME-Type (e.g., image/png)
  const fileBuffer = file.data // Buffer of the file

  // Check if file is an image
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!mimeType || !validImageTypes.includes(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Uploaded file is not a valid image' })
  }

  // Upload file
  await uploadFile(fileName, userPath, mimeType, fileBuffer).catch((error) => {
    console.error('File upload failed:', error)
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to upload file' })
  })

  // Return
  return {
    statusCode: 200,
    statusMessage: 'File uploaded successfully',
    fileName,
    mimeType,
    size: fileBuffer.length,
    success: true,
  }
})
