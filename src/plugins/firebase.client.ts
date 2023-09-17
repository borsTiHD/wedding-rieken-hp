import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const { firebase } = config.public // Set in nuxt.config.ts

    const app = initializeApp({ ...firebase })
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    return {
        provide: {
            auth,
            firestore
        }
    }
})
