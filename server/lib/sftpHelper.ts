import type { FtpFile } from '@@/shared/types/ImageFile'
import type { Buffer } from 'node:buffer'
import SftpClass from '@@/server/lib/sftp'

async function uploadFile(filePath: string, fileBuffer: Buffer<ArrayBufferLike>) {
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

async function listFiles(remotePath: string) {
  // Initialize SFTP client
  const SftpClient = new SftpClass()
  await SftpClient.connect()

  try {
    // List files in the specified remote directory
    const files = await SftpClient.list(remotePath)
    return files as FtpFile[]
  }
  catch (error: any) {
    console.error(`Failed to list files: ${error.message}`)
    throw new Error(`Failed to list files: ${error.message}`)
  }
  finally {
    // Close the SFTP connection
    await SftpClient.end()
  }
}

async function downloadFile(remotePath: string) {
  // Initialize SFTP client
  const SftpClient = new SftpClass()
  await SftpClient.connect()

  try {
    // Download the file from the SFTP server
    const fileBuffer = await SftpClient.download(remotePath)
    return fileBuffer
  }
  catch (error: any) {
    console.error(`Failed to download file: ${error.message}`)
    throw new Error(`Failed to download file: ${error.message}`)
  }
  finally {
    // Close the SFTP connection
    await SftpClient.end()
  }
}

export {
  downloadFile,
  listFiles,
  uploadFile,
}
