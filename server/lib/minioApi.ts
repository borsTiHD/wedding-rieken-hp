import type { BucketItemStat, ItemBucketMetadata } from 'minio'
import type { Buffer } from 'node:buffer'
import { bucket, checkBucketExists, MinioClient } from '@@/server/lib/minioInit'
import sharp from 'sharp'

async function getAllFiles(filePath: string): Promise<Array<{ metadata: BucketItemStat, file: ItemBucketMetadata }>> {
  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)

  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  const objectsList: Array<{ metadata: BucketItemStat, file: ItemBucketMetadata }> = [] // Explicitly type the array
  const recursive = false

  return new Promise((resolve, reject) => {
    const objectsStream = MinioClient.listObjects(bucket, filePath || '', recursive, { IncludeVersion: true })
    const metadataPromises: Promise<void>[] = [] // Array to track metadata fetch promises

    objectsStream.on('data', (obj: ItemBucketMetadata) => {
      const metadataPromise = MinioClient.statObject(bucket, obj.name)
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

async function getPreviewUrl(objectName: string, expirySeconds: number = 3600): Promise<string> {
  // Check if bucket exists
  const bucketExists = await checkBucketExists(bucket)

  if (!bucketExists) {
    throw new Error('Minio: Bucket does not exist')
  }

  try {
    // Generate a presigned URL for the object
    const url = await MinioClient.presignedUrl('GET', bucket, objectName, expirySeconds)
    return url
  }
  catch (error) {
    console.error(`Error generating preview URL for object ${objectName}:`, error)
    throw new Error('Failed to generate preview URL')
  }
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
  const thumbnailBuffer = await sharp(fileBuffer).resize(200, 200).toBuffer()

  // Upload the thumbnail
  const thumbnailPath = `thumbnails/${filePath}`
  await MinioClient.putObject(
    bucket,
    thumbnailPath,
    thumbnailBuffer,
    thumbnailBuffer.length, // Optional size
    {
      ...metaData,
      'X-Amz-Meta-Thumbnail': 'true',
    },
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
  const thumbnailPath = `thumbnails/${filePath}`

  try {
    // Attempt to delete the thumbnail
    await MinioClient.removeObject(bucket, thumbnailPath)
  } catch (error) {
    console.warn(`Thumbnail not found or failed to delete: ${thumbnailPath}`, error)
  }
}

export {
  deleteFile,
  getAllFiles,
  getPreviewUrl,
  uploadFile,
}
