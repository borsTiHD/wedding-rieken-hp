import * as Minio from 'minio'

const config = useRuntimeConfig()
const minioConfig = config.minioAdmin // Set in nuxt.config.ts

// Minio configuration
// minioAdmin: {
//     endpoint: process.env.NUXT_MINIO_ENDPOINT,
//     port: process.env.NUXT_MINIO_PORT,
//     useSSL: process.env.NUXT_MINIO_USE_SSL === 'true',
//     accessKey: process.env.NUXT_MINIO_ACCESS_KEY,
//     secretKey: process.env.NUXT_MINIO_SECRET_KEY,
//     bucket: process.env.NUXT_MINIO_BUCKET,
//   },

interface MinioConfig {
  endpoint: string
  port?: string
  useSSL: boolean
  accessKey: string
  secretKey: string
  bucket: string
}

// Check if object is a valid MinioConfig object
function isValidConfig(config: MinioConfig): boolean {
  return config
    && typeof config.endpoint === 'string'
    && (typeof config.port === 'string' || config.port === undefined) // Allow undefined
    && typeof config.useSSL === 'boolean'
    && typeof config.accessKey === 'string'
    && typeof config.secretKey === 'string'
    && typeof config.bucket === 'string'
}

// Check if minioConfig is set correctly
if (!isValidConfig(minioConfig)) {
  throw new Error('Minio: Invalid configuration')
}

// Initialize Minio client
const MinioClient = new Minio.Client({
  endPoint: minioConfig.endpoint,
  port: minioConfig.port !== undefined ? Number.parseInt(minioConfig.port, 10) : undefined, // Optional
  useSSL: minioConfig.useSSL,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey,
})

const bucket = minioConfig.bucket

// Check if bucket exists
async function checkBucketExists(bucket: string): Promise<boolean> {
  try {
    const exists = await MinioClient.bucketExists(bucket)
    return exists
  }
  catch (error) {
    console.error('Error checking bucket existence:', error)
    throw error
  }
}

// Return Minio client and bucket existence check function
export {
  bucket,
  checkBucketExists,
  MinioClient,
}
