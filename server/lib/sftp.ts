import type { Buffer } from 'node:buffer'
import { dirname } from 'node:path'
import SftpClient from 'ssh2-sftp-client'

interface Config {
  host: string
  port?: number
  username: string
  password?: string
  privateKey?: string | Buffer
  passphrase?: string
  debug?: (message: string) => void
}

export class SftpClass {
  private client: SftpClient
  private config: Config

  constructor() {
    this.client = new SftpClient()

    const config = useRuntimeConfig()
    const sftpConfig = config.sftpConfig // Set in nuxt.config.ts

    this.config = {
      host: sftpConfig.host,
      port: sftpConfig.port,
      username: sftpConfig.username,
      // debug: (message: string) => {
      //   console.log('SFTP Debug:', message)
      // },
    }

    // Conditionally add optional fields
    if (sftpConfig.password && sftpConfig.password !== 'false') {
      this.config.password = sftpConfig.password
    }
    if (sftpConfig.privateKey && sftpConfig.privateKey !== 'false') {
      // Replace any number of backslashes followed by 'n' with a newline character
      // This is necessary because of differences in how the private key is stored in the environment variable for vercel and coolify (vercel uses \n, coolify uses \\n)
      const formattedPrivateKey = sftpConfig.privateKey.replace(/\\+n/g, '\n')
      this.config.privateKey = formattedPrivateKey
    }
    if (sftpConfig.passphrase && sftpConfig.passphrase !== 'false') {
      this.config.passphrase = sftpConfig.passphrase
    }
  }

  async connect(config?: Config): Promise<void> {
    // console.log('Connecting to SFTP server with config:', config || this.config)
    await this.client.connect(config || this.config)
  }

  async upload(filePath: string, file: Buffer<ArrayBufferLike>): Promise<void> {
    const remoteDir = dirname(filePath)
    await this.ensureDir(remoteDir)
    await this.client.put(file, filePath)
  }

  async download(remotePath: string): Promise<Buffer<ArrayBufferLike>> {
    return this.client.get(remotePath) as Promise<Buffer<ArrayBufferLike>>
  }

  async delete(remotePath: string): Promise<void> {
    await this.client.delete(remotePath)
  }

  async list(remotePath: string): Promise<any[]> {
    return this.client.list(remotePath)
  }

  async end(): Promise<void> {
    await this.client.end()
  }

  /**
   * Ensures that the given remote directory exists, creating it recursively if necessary.
   * @param remoteDir The remote directory path to ensure.
   */
  async ensureDir(remoteDir: string): Promise<void> {
    if (!remoteDir || remoteDir === '/' || remoteDir === '.')
      return
    const dirs = remoteDir.split('/').filter(Boolean)
    let current = remoteDir.startsWith('/') ? '/' : ''
    for (const dir of dirs) {
      current = current.endsWith('/') ? current + dir : `${current}/${dir}`
      try {
        const stat = await this.client.stat(current)
        if (!stat.isDirectory) {
          throw new Error(`Remote path ${current} exists and is not a directory`)
        }
      }
      catch (err: any) {
        // If error code is 2, the directory does not exist
        if (err.code === 2 || /no such file/i.test(err.message)) {
          await this.client.mkdir(current)
        }
        else {
          throw err
        }
      }
    }
  }
}

export default SftpClass
