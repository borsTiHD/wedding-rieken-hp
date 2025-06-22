import type { Buffer } from 'node:buffer'
import sharp from 'sharp'

function getUserPath(userId: string): string {
  // Construct the user path based on the user ID
  return `/user/${userId}`
}

function getOriginalPath(userPath: string, fileName?: string): string {
  return fileName
    ? `${userPath}/original/${fileName}`
    : `${userPath}/original`
}

function getThumbnailPath(userPath: string, fileName: string): string {
  // Construct the thumbnail path with a .jpg extension
  return `${userPath}/thumbnails/${fileName.replace(/\.[^/.]+$/, '.jpg')}`
}

function getMediumPath(userPath: string, fileName: string): string {
  // Construct the medium path with a .jpg extension
  return `${userPath}/medium/${fileName.replace(/\.[^/.]+$/, '.jpg')}`
}

async function generateThumbnail(fileBuffer: Buffer): Promise<Buffer> {
  return sharp(fileBuffer)
    .rotate() // Normalize orientation based on EXIF metadata
    .resize({ width: 400, withoutEnlargement: true }) // Resize to 400px width
    .jpeg({ quality: 60 }) // Convert to JPEG with 60% quality
    .toBuffer()
}

async function generateMediumImage(fileBuffer: Buffer): Promise<Buffer> {
  return sharp(fileBuffer)
    .rotate() // Normalize orientation based on EXIF metadata
    .resize({ width: 1000, withoutEnlargement: true }) // Resize to 1000px width
    .jpeg({ quality: 60 }) // Convert to JPEG with 60% quality
    .toBuffer()
}

export {
  generateMediumImage,
  generateThumbnail,

  getMediumPath,
  getOriginalPath,
  getThumbnailPath,
  getUserPath,
}
