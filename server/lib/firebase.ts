// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const config = useRuntimeConfig()

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: config.firebaseApikey,
    authDomain: config.firebaseAuthdomain,
    projectId: config.firebaseProjectid,
    storageBucket: config.firebaseStoragebucket,
    messagingSenderId: config.firebaseMessagingsenderid,
    appId: config.firebaseAppid,
    measurementId: config.firebaseMeasurementid
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const firestoreDb = getFirestore(firebaseApp)
