import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    doc,
    // query,
    // where,
    setDoc
    // collectionGroup,
    // Timestamp
} from 'firebase/firestore'
import { firestoreDb } from '@/server/lib/firebase'

// Get firestore documents by collection
export const queryByCollection = async(col: string) => {
    const colRef = collection(firestoreDb, col)
    const snapshot = await getDocs(colRef)

    const docs = Array.from(snapshot.docs).map((doc) => {
        return {
            ...doc.data(),
            id: doc.id
        }
    })

    return docs
}

// Get firestore documents by collection and id
export const queryByCollectionAndId = async(col: string, id: string) => {
    const docRef = doc(firestoreDb, col, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        throw new Error('Document does not exist')
    }

    return {
        ...docSnap.data(),
        id: docSnap.id
    }
}

// Set firestore document by collection
export const set = async(col: string, document: any) => {
    await setDoc(doc(collection(firestoreDb, col)), document, { merge: true })
}

// Add firestore document by collection
export const add = async(col: string, document: any) => {
    const colRef = collection(firestoreDb, col)
    const docRef = await addDoc(colRef, document)
    return docRef
}

// Delete firestore document by collection and id
export const del = async(col: string, id: string) => {
    const docRef = doc(firestoreDb, col, id)
    return await deleteDoc(docRef)
}
