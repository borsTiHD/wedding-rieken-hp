import type { ImageFile, ItemMetadata } from '@@/shared/types/ImageFile'
import type { Buffer } from 'node:buffer'
import { generateMediumImage, generateThumbnail, getMediumPath, getThumbnailPath } from '@@/server/lib/filesHelper'
import SftpClass from '@@/server/lib/sftp'

async function uploadFile(fileName: string, userPath: string, fileType: string, fileBuffer: Buffer<ArrayBufferLike>) {
  // Upload the original file
  const origFilePath = `${userPath}/${fileName}`
  await uploadFileHelper(origFilePath, fileBuffer)

  // Generate and upload thumbnail
  const thumbnailBuffer = await generateThumbnail(fileBuffer)
  const thumbnailPath = getThumbnailPath(userPath, fileName) // Ensure thumbnail has .jpg extension
  await uploadFileHelper(thumbnailPath, thumbnailBuffer)

  // Generate and upload medium image
  const mediumBuffer = await generateMediumImage(fileBuffer)
  const mediumPath = getMediumPath(userPath, fileName) // Ensure medium image has .jpg extension
  await uploadFileHelper(mediumPath, mediumBuffer)

  return true
}

async function uploadFileHelper(filePath: string, fileBuffer: Buffer<ArrayBufferLike>) {
  // Initialize SFTP client
  const SftpClient = new SftpClass()
  await SftpClient.connect()

  try {
    // Upload the file to the SFTP server
    await SftpClient.upload(filePath, fileBuffer)
  }
  catch (error: any) {
    console.error(`Failed to upload file: ${error.message}`)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
  finally {
    // Close the SFTP connection
    await SftpClient.end()
  }
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
