import type { ServiceAccount } from 'firebase-admin'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const config = useRuntimeConfig()
const firebaseConfig = config.firebaseAdmin // Set in nuxt.config.ts

// Replace any number of backslashes followed by 'n' with a newline character
// This is necessary because of differences in how the private key is stored in the environment variable for vercel and coolify (vercel uses \n, coolify uses \\n)
const formattedPrivateKey = firebaseConfig.privateKey.replace(/\\+n/g, '\n')

const serviceAccount: ServiceAccount = {
  projectId: firebaseConfig.projectId,
  privateKey: formattedPrivateKey,
  clientEmail: firebaseConfig.clientEmail,
}

// Check if object is a valid ServiceAccount object
function isValidServiceAccount(account: ServiceAccount): boolean {
  return account
    && typeof account.projectId === 'string'
    && typeof account.privateKey === 'string'
    && typeof account.clientEmail === 'string'
}

// Check if serviceAccount is set correctly
if (!isValidServiceAccount(serviceAccount)) {
  throw new Error('Firebase: Invalid service account configuration')
}

// Initialize Firebase
let firebaseApp: admin.app.App
try {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
  })
  console.log('Firebase Admin SDK initialized successfully')
}
catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error)
  throw error
}

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
