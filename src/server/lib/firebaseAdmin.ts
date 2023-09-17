import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { ServiceAccount } from 'firebase-admin/lib/credential'

const config = useRuntimeConfig()
const firebaseConfig = config.firebaseAdmin // Set in nuxt.config.ts
const serviceAccount = {
    projectId: firebaseConfig.projectId,
    privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
    clientEmail: firebaseConfig.clientEmail
} as ServiceAccount

// Initialize Firebase
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
})

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)
