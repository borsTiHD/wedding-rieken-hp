import type { ImageFile } from '@@/shared/types/ImageFile'
import type { Buffer } from 'node:buffer'
import {
  generateMediumImage,
  generateThumbnail,
  getMediumPath,
  getOriginalPath,
  getThumbnailPath,
} from '@@/server/lib/filesHelper'
import {
  listFiles,
  uploadFile as sftpUploadFile,
} from '@@/server/lib/sftpHelper'

async function uploadFile(fileName: string, userPath: string, fileType: string, fileBuffer: Buffer<ArrayBufferLike>) {
  // Upload the original file
  const origFilePath = getOriginalPath(userPath, fileName)
  await sftpUploadFile(origFilePath, fileBuffer)

  // Generate and upload thumbnail
  const thumbnailBuffer = await generateThumbnail(fileBuffer)
  const thumbnailPath = getThumbnailPath(userPath, fileName) // Ensure thumbnail has .jpg extension
  await sftpUploadFile(thumbnailPath, thumbnailBuffer)

  // Generate and upload medium image
  const mediumBuffer = await generateMediumImage(fileBuffer)
  const mediumPath = getMediumPath(userPath, fileName) // Ensure medium image has .jpg extension
  await sftpUploadFile(mediumPath, mediumBuffer)

  return true
}

async function getListAllFiles(remotePath: string) {
  return listFiles(remotePath)
}

async function getAllFilesPaginated(remotePath: string, offset: number, limit: number) {
  const files = await listFiles(remotePath)
  const totalFiles = files.length
  const totalPages = Math.ceil(totalFiles / limit)

  // Calculate start and end indices for pagination
  const startIndex = offset > 0 ? offset : 0
  const endIndex = startIndex + limit

  // Slice the files array to get the paginated results
  const paginatedFiles = files.slice(startIndex, endIndex)

  // Map the files to the desired format
  const formattedFiles: ImageFile[] = paginatedFiles.map(file => ({
    name: file.name,
    lastModified: new Date(file.modifyTime), // Convert lastModified to Date
    size: file.size,
    type: file.type,
  }))

  return {
    files: formattedFiles,
    totalFiles,
    totalPages,
  }
}

export {
  //   deleteFile,
  //   downloadFile,
  //   downloadFolder,
  getAllFilesPaginated,
  getListAllFiles,
  //   getMetadata,
  //   getPreviewUrl,
  uploadFile,
}
