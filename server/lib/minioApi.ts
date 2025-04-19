import type { ItemBucketMetadata } from 'minio'
import type { Buffer } from 'node:buffer'
import { bucket, checkBucketExists, MinioClient } from '@@/server/lib/minioInit'

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

  return MinioClient.putObject(
    bucket,
    filePath,
    fileBuffer,
    fileBuffer.length, // Optional size
    metaData,
  )
}

export {
  uploadFile,
}
