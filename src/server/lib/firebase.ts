// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = useRuntimeConfig()
const { firebase } = config.public // Set in nuxt.config.ts

// Initialize Firebase
export const firebaseApp = initializeApp({ ...firebase })
export const firestoreDb = getFirestore(firebaseApp)
