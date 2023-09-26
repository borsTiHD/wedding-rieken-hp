// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase SDK for server-side rendering
const config = useRuntimeConfig()
const { firebase } = config.public // Set in nuxt.config.ts

// Initialize Firebase
export const firebaseApp = initializeApp({ ...firebase })
export const firestoreDb = getFirestore(firebaseApp)
