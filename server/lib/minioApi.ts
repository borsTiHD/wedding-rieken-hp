import type { MinioFile } from '@@/shared/types/MinioFile'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { BucketItem, ItemBucketMetadata } from 'minio'
import type { Buffer } from 'node:buffer'
import { bucket, checkBucketExists, MinioClient } from '@@/server/lib/minioInit'
import archiver from 'archiver'
import sharp from 'sharp'

const presignedUrlCache = new Map<string, { url: string, expiresAt: number }>()

function getThumbnailPath(filePath: string): string {
  // Construct the thumbnail path with a .jpg extension
  return `thumbnails/${filePath.replace(/\.[^/.]+$/, '.jpg')}`
}

async function getMetadata(filePath: string) {
  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)

  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  try {
    // Fetch metadata for the object
    return MinioClient.statObject(bucket, filePath)
  }
  catch (error) {
    console.error(`Error fetching metadata for object ${filePath}:`, error)
    throw new Error('Failed to fetch metadata')
  }
}

async function getAllFiles(filePath: string): Promise<Array<MinioFile>> {
  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)

  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  const objectsList: Array<MinioFile> = [] // Explicitly type the array
  const recursive = false

  return new Promise((resolve, reject) => {
    const objectsStream = MinioClient.listObjects(bucket, filePath || '', recursive)
    const metadataPromises: Promise<void>[] = [] // Array to track metadata fetch promises

    objectsStream.on('data', (obj: BucketItem) => {
      const metadataPromise = getMetadata(obj.name as string)
        .then((metadata) => {
          objectsList.push({ metadata, file: obj })
        })
        .catch((error) => {
          console.error(`Error fetching metadata for object ${obj.name}:`, error)
        })

      metadataPromises.push(metadataPromise) // Add the promise to the array
    })

    objectsStream.on('error', (e) => {
      console.error('Error listing objects:', e)
      reject(e) // Reject the promise on error
    })

    objectsStream.on('end', () => {
      // Wait for all metadata fetch promises to complete
      Promise.allSettled(metadataPromises)
        .then((results) => {
          results.forEach((result, index) => {
            if (result.status !== 'fulfilled') {
              console.error(`Metadata fetch failed for object ${objectsList[index]?.file?.name}:`, result.reason)
            }
          })

          resolve(objectsList) // Resolve the promise with the objects list
        })
        .catch((error) => {
          console.error('Unexpected error while resolving metadata promises:', error)
          reject(error) // Reject if an unexpected error occurs
        })
    })
  })
}

async function getPreviewUrl(objectName: string, getThumbnail: boolean, expirySeconds: number = 3600): Promise<string> {
  const filePath = getThumbnail ? getThumbnailPath(objectName) : objectName

  // Check if the URL is already cached and still valid
  const cached = presignedUrlCache.get(filePath)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url
  }

  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)
  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  try {
    // Generate a new presigned URL
    const url = await MinioClient.presignedUrl('GET', bucket, filePath, expirySeconds)

    // Cache the URL with its expiration time
    presignedUrlCache.set(filePath, {
      url,
      expiresAt: Date.now() + expirySeconds * 1000, // Cache expiration time
    })

    return url
  }
  catch (error) {
    console.error(`Error generating preview URL for object ${objectName}:`, error)
    throw new Error('Failed to generate preview URL')
  }
}

async function downloadFile(event: H3Event<EventHandlerRequest>, filePath: string) {
  try {
    // Get metadata for the file
    const metadata = await getMetadata(filePath)

    // Stream the file from MinIO
    const stream = await MinioClient.getObject(bucket, filePath)
    if (!stream) {
      throw createError({ statusCode: 404, statusMessage: 'MinioFile not found' })
    }

    // Set headers for file download
    // Metadata 'original-filename' is set in uploadFile
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${metadata?.metaData?.['original-filename'] || filePath}"`)
    event.node.res.setHeader('Content-Type', 'application/octet-stream')

    // Pipe the stream to the response
    return sendStream(event, stream)
  }
  catch (error) {
    console.error(`Error downloading file ${filePath}:`, error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to download file' })
  }
}

async function downloadFolder(event: H3Event<EventHandlerRequest>, folderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const objectsStream = MinioClient.listObjects(bucket, folderPath, true)
      const fileName = 'images.zip' // folderPath.split('/').pop() || 'download.zip'

      // Create a zip archive
      const archive = archiver('zip', { zlib: { level: 9 } })

      // Handle errors in the archive
      archive.on('error', (err) => {
        console.error('Error creating archive:', err)
        reject(createError({ statusCode: 500, statusMessage: 'Failed to create archive' }))
      })

      // Pipe the archive to the response
      event.node.res.setHeader('Content-Type', 'application/zip')
      event.node.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
      archive.pipe(event.node.res)

      // Track asynchronous file appending
      const appendPromises: Promise<void>[] = []

      // Add files to the archive
      objectsStream.on('data', (obj) => {
        const appendPromise = (async () => {
          try {
            const filePath = obj.name as string
            const fileStream = await MinioClient.getObject(bucket, filePath)
            archive.append(fileStream, { name: filePath.replace(`${folderPath}/`, '') })
          }
          catch (err) {
            console.error(`Error appending file ${obj.name} to archive:`, err)
          }
        })()
        appendPromises.push(appendPromise)
      })

      // Finalize the archive when all files are appended
      objectsStream.on('end', async () => {
        try {
          await Promise.all(appendPromises) // Wait for all files to be appended
          archive.finalize() // Finalize the archive
        }
        catch (err) {
          console.error('Error finalizing archive:', err)
          reject(createError({ statusCode: 500, statusMessage: 'Failed to finalize archive' }))
        }
      })

      // Resolve the promise when the archive is finalized
      archive.on('end', () => {
        resolve()
      })

      // Handle errors in the object stream
      objectsStream.on('error', (err) => {
        console.error('Error listing objects:', err)
        reject(createError({ statusCode: 500, statusMessage: 'Failed to list objects' }))
      })
    }
    catch (err) {
      console.error('Unexpected error in downloadFolder:', err)
      reject(createError({ statusCode: 500, statusMessage: 'Unexpected error occurred' }))
    }
  })
}

async function uploadFile(fileName: string, filePath: string, fileType: string, fileBuffer: Buffer<ArrayBufferLike>) {
  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)

  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  const metaData: ItemBucketMetadata = {
    'Content-Type': fileType,
    'Content-Length': fileBuffer.length.toString(),
    'X-Amz-Meta-Original-Filename': fileName,
    'X-Amz-Meta-Original-Path': filePath,
    'X-Amz-Meta-Original-Filetype': fileType,
  }

  // Generate a thumbnail
  const thumbnailBuffer = await sharp(fileBuffer)
    .rotate() // Normalize orientation based on EXIF metadata
    .resize({ width: 1000, withoutEnlargement: true }) // Resize to 1000px width while maintaining aspect ratio
    .jpeg({ quality: 60 }) // Convert to JPEG with 60% quality
    .toBuffer()

  // Upload the thumbnail
  const thumbnailPath = getThumbnailPath(filePath) // Ensure thumbnail has .jpg extension
  await MinioClient.putObject(
    bucket,
    thumbnailPath,
    thumbnailBuffer,
    thumbnailBuffer.length, // Optional size
    {
      ...metaData,
      'X-Amz-Meta-Thumbnail': 'true',
    } as ItemBucketMetadata,
  )

  return MinioClient.putObject(
    bucket,
    filePath,
    fileBuffer,
    fileBuffer.length, // Optional size
    metaData,
  )
}

async function deleteFile(filePath: string) {
  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)

  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  // Delete the main file
  await MinioClient.removeObject(bucket, filePath)

  // Construct the thumbnail path
  const thumbnailPath = getThumbnailPath(filePath)

  try {
    // Attempt to delete the thumbnail
    await MinioClient.removeObject(bucket, thumbnailPath)
  }
  catch (error) {
    console.warn(`Thumbnail not found or failed to delete: ${thumbnailPath}`, error)
  }
}

export {
  deleteFile,
  downloadFile,
  downloadFolder,
  getAllFiles,
  getMetadata,
  getPreviewUrl,
  uploadFile,
}
