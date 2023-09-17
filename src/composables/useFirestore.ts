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

export function useFirestore() {
    // From firebase.client.ts
    const { $firestore } = useNuxtApp()

    // Query a collection
    const queryByCollection = async(col: string) => {
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
    const queryByCollectionAndId = async(col: string, id: string) => {
        const docRef = doc($firestore, col, id)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
            throw new Error('Document does not exist')
        }

        return docSnap.data()
    }

    // Set a document by ID
    const set = async(col: string, document: any) => {
        return await setDoc(doc(collection($firestore, col)), document, { merge: true })
    }

    // Updates a key of a document by ID
    const update = async(col: string, id: string, key: string, value: any) => {
        const docRef = doc($firestore, col, id)
        // Set the "key" field of the document
        return await updateDoc(docRef, {
            [key]: value
        })
    }

    // Add a document with a specified ID
    const addWithId = async(col: string, id: string, document: any) => {
        const colRef = collection($firestore, col)
        const docRef = await setDoc(doc(colRef, id), document)
        return docRef
    }

    // Add a document with a random ID
    const add = async(col: string, document: any) => {
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
        set,
        update,
        addWithId,
        add,
        del
    }
}
