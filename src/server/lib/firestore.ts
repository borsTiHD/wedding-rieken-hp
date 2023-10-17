import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    // query,
    // where,
    setDoc
    // collectionGroup,
    // Timestamp
} from 'firebase/firestore'
import { firestoreDb } from '@/server/lib/firebase'

// Types for firestore documents
type Value = string | number | boolean | null | undefined | Document | Array<string | number | boolean | null | undefined | Document>
interface Document {
    [key: string]: Value
}

// Get firestore documents by collection
export const queryByCollection = async(col: string): Promise<Document[]> => {
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
export const queryByCollectionAndId = async(col: string, id: string): Promise<Document> => {
    const docRef = doc(firestoreDb, col, id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        throw new Error('custom/document-does-not-exist')
    }

    return {
        ...docSnap.data(),
        id: docSnap.id
    }
}

// Set firestore document by collection
export const set = async(col: string, document: Document): Promise<void> => {
    return await setDoc(doc(collection(firestoreDb, col)), document, { merge: true })
}

// Update firestore document by collection and id
export const update = async(col: string, id: string, key: string, value: Value) => {
    const docRef = doc(firestoreDb, col, id)
    // Set the "key" field of the document
    return await updateDoc(docRef, {
        [key]: value
    })
}

// Add firestore document by collection
export const add = async(col: string, document: Document) => {
    const colRef = collection(firestoreDb, col)
    const docRef = await addDoc(colRef, document)
    return docRef
}

// Delete firestore document by collection and id
export const del = async(col: string, id: string) => {
    const docRef = doc(firestoreDb, col, id)
    return await deleteDoc(docRef)
}
