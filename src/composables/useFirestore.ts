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
    setDoc,
    arrayUnion,
    arrayRemove
    // collectionGroup,
    // Timestamp
} from 'firebase/firestore'
import type { PartialConfig } from '@/types/Config'

// Types for firestore documents
type Value = string | number | boolean | null | undefined | Document | Array<string | number | boolean | null | undefined | Document>
interface Document {
    [key: string]: Value
}

export function useFirestore() {
    // From firebase.client.ts
    const { $firestore } = useNuxtApp()

    // Query a collection
    const queryByCollection = async(col: string): Promise<Document[]> => {
        const colRef = collection($firestore, col)
        const snapshot = await getDocs(colRef)

        const docs = Array.from(snapshot.docs).map((doc) => {
            return {
                ...doc.data(),
                id: doc.id
            }
        })

        return docs
    }

    // Query a document by collection and ID
    const queryByCollectionAndId = async(col: string, id: string): Promise<Document> => {
        const docRef = doc($firestore, col, id)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
            throw new Error('custom/document-does-not-exist')
        }

        return docSnap.data()
    }

    // Delete a document by collection and ID
    const deleteByCollectionAndId = async(col: string, id: string) => {
        const docRef = doc($firestore, col, id)
        return await deleteDoc(docRef)
    }

    // Update a document by collection and ID
    const updateByCollectionAndId = async(col: string, id: string, document: Document | PartialConfig) => {
        const docRef = doc($firestore, col, id)
        return await updateDoc(docRef, document)
    }

    // Update an array field of a document by collection and ID
    const updateArrayFieldByCollectionAndId = async(col: string, id: string, key: string, value: Value) => {
        const docRef = doc($firestore, col, id)
        return await updateDoc(docRef, {
            [key]: arrayUnion(value)
        })
    }

    // Remove an item from an array field of a document by collection and ID
    const removeArrayFieldByCollectionAndId = async(col: string, id: string, key: string, value: Value) => {
        const docRef = doc($firestore, col, id)
        return await updateDoc(docRef, {
            [key]: arrayRemove(value)
        })
    }

    // Add a document with a specified collection and ID
    const addByCollectionAndId = async(col: string, id: string, document: unknown) => {
        const colRef = collection($firestore, col)
        return await setDoc(doc(colRef, id), document)
    }

    // Set a document by ID
    const set = async(col: string, document: Document): Promise<void> => {
        return await setDoc(doc(collection($firestore, col)), document, { merge: true })
    }

    // Updates a key of a document by ID
    const update = async(col: string, id: string, key: string, value: Value) => {
        const docRef = doc($firestore, col, id)
        // Set the "key" field of the document
        return await updateDoc(docRef, {
            [key]: value
        })
    }

    // Add a document with a random ID
    const add = async(col: string, document: Document) => {
        const colRef = collection($firestore, col)
        const docRef = await addDoc(colRef, document)
        return docRef
    }

    // Delete a document by ID
    const del = async(col: string, id: string) => {
        const docRef = doc($firestore, col, id)
        return await deleteDoc(docRef)
    }

    return {
        queryByCollection,
        queryByCollectionAndId,
        deleteByCollectionAndId,
        updateByCollectionAndId,
        updateArrayFieldByCollectionAndId,
        removeArrayFieldByCollectionAndId,
        addByCollectionAndId,
        set,
        update,
        add,
        del
    }
}
