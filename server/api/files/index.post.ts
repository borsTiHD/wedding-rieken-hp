import { randomUUID } from 'node:crypto'
import checkAdmin from '@@/server/lib/checkAdmin'
import { uploadFile } from '@@/server/lib/minioApi'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  await checkAdmin(event)

  // Form data to get uploaded file
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' })
  }

  // Get file path from form data
  const pathRaw = formData.find(field => field?.name === 'path')
  const path = pathRaw?.data?.toString() || undefined

  // Get file from form data
  const file = formData.find(field => field?.name === 'file' && field?.type && field?.data && field?.data?.length > 0 && field?.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file found in form data' })
  }

  // Get file information
  const fileName = file.filename || `${randomUUID()}` // Original file name
  const fileFullPath = path ? `${path}/${fileName}` : fileName
  const mimeType = file.type // MIME-Type (e.g., image/png)
  const fileBuffer = file.data // Buffer of the file

  // Check if file is an image
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!mimeType || !validImageTypes.includes(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Uploaded file is not a valid image' })
  }

  // Upload file to Minio
  const uploadResult = await uploadFile(fileName, fileFullPath, mimeType, fileBuffer)

  if (!uploadResult) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload file' })
  }

  // Return
  return {
    statusCode: 200,
    statusMessage: 'File uploaded successfully',
    fileName,
    mimeType,
    size: fileBuffer.length,
    success: true,

    // MinIO response
    ...uploadResult,
  }
})
