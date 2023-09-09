// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore/lite'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const config = useRuntimeConfig()

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: config.firebase_apiKey,
    authDomain: config.firebase_authDomain,
    projectId: config.firebase_projectId,
    storageBucket: config.firebase_storageBucket,
    messagingSenderId: config.firebase_messagingSenderId,
    appId: config.firebase_appId,
    measurementId: config.firebase_measurementId
}

console.log('firebaseConfig', firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

console.log('app', app)
console.log('analytics', analytics)

export const firestoreDb = getFirestore(app)
