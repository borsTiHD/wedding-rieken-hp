import type { ImageFile, ItemMetadata } from '@@/shared/types/ImageFile'
import type { Buffer } from 'node:buffer'
import SftpClass from '@@/server/lib/sftp'
import sharp from 'sharp'

async function uploadFile(fileName: string, filePath: string, fileType: string, fileBuffer: Buffer<ArrayBufferLike>) {
  // Initialize SFTP client
  const SftpClient = new SftpClass()

  await SftpClient.connect()
  try {
    console.log(`Uploading file: ${fileName} to ${filePath}`)
    console.log(`fileName:`, fileName)
    console.log(`filePath:`, filePath)
    // Upload the file to the SFTP server
    await SftpClient.upload(filePath, fileBuffer)
    console.log(`File uploaded successfully: ${fileName} to ${filePath}`)
  }
  catch (error: any) {
    console.error(`Failed to upload file: ${error.message}`)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
  finally {
    // Close the SFTP connection
    await SftpClient.end()
  }

  return true

  // Check if bucket exists
  // const bucketExists = await checkBucketExists(bucket)

  // if (!bucketExists) {
  //   throw new Error('Minio: Bucket does not exist')
  // }

  // const metaData: ItemMetadata = {
  //   'Content-Type': fileType,
  //   'Content-Length': fileBuffer.length.toString(),
  //   'X-Amz-Meta-Original-Filename': fileName,
  //   'X-Amz-Meta-Original-Path': filePath,
  //   'X-Amz-Meta-Original-Filetype': fileType,
  // }

  // // Generate a thumbnail
  // const thumbnailBuffer = await sharp(fileBuffer)
  //   .rotate() // Normalize orientation based on EXIF metadata
  //   .resize({ width: 400, withoutEnlargement: true }) // Resize to 400px width while maintaining aspect ratio
  //   .jpeg({ quality: 60 }) // Convert to JPEG with 60% quality
  //   .toBuffer()

  // // Generate a medium image
  // const mediumBuffer = await sharp(fileBuffer)
  //   .rotate() // Normalize orientation based on EXIF metadata
  //   .resize({ width: 1000, withoutEnlargement: true }) // Resize to 1000px width while maintaining aspect ratio
  //   .jpeg({ quality: 60 }) // Convert to JPEG with 60% quality
  //   .toBuffer()

  // // Upload the thumbnail
  // const thumbnailPath = getThumbnailPath(filePath) // Ensure thumbnail has .jpg extension
  // await MinioClient.putObject(
  //   bucket,
  //   thumbnailPath,
  //   thumbnailBuffer,
  //   thumbnailBuffer.length, // Optional size
  //   {
  //     ...metaData,
  //     'X-Amz-Meta-Thumbnail': 'true',
  //   } as ItemBucketMetadata,
  // )

  // // Upload the medium image
  // const mediumPath = getMediumPath(filePath) // Ensure medium image has .jpg extension
  // await MinioClient.putObject(
  //   bucket,
  //   mediumPath,
  //   mediumBuffer,
  //   mediumBuffer.length, // Optional size
  //   {
  //     ...metaData,
  //     'X-Amz-Meta-Medium': 'true',
  //   } as ItemBucketMetadata,
  // )

  // return MinioClient.putObject(
  //   bucket,
  //   filePath,
  //   fileBuffer,
  //   fileBuffer.length, // Optional size
  //   metaData,
  // )
}

export {
//   deleteFile,
//   downloadFile,
//   downloadFolder,
//   getAllFilesPaginated,
//   getListAllFiles,
//   getMetadata,
//   getPreviewUrl,
  uploadFile,
}
