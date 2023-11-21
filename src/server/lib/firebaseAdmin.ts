import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { ServiceAccount } from 'firebase-admin/lib/credential'

const config = useRuntimeConfig()
const firebaseConfig = config.firebaseAdmin // Set in nuxt.config.ts
const serviceAccount: ServiceAccount = {
    projectId: firebaseConfig.projectId,
    privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
    clientEmail: firebaseConfig.clientEmail
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
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
})

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
