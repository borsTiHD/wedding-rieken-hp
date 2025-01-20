import { firestoreDb } from '@@/server/lib/firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  // query,
  // where,
  setDoc,
  updateDoc,
  // collectionGroup,
  // Timestamp
} from 'firebase/firestore'

// Types for firestore documents
type Value = string | number | boolean | null | undefined | Document | Array<string | number | boolean | null | undefined | Document>
interface Document {
  [key: string]: Value
}

// Get firestore documents by collection
export async function queryByCollection(col: string): Promise<Document[]> {
  const colRef = collection(firestoreDb, col)
  const snapshot = await getDocs(colRef)

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  })

  return docs
}

// Get firestore documents by collection and id
export async function queryByCollectionAndId(col: string, id: string): Promise<Document> {
  const docRef = doc(firestoreDb, col, id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    throw new Error('custom/document-does-not-exist')
  }

  return {
    ...docSnap.data(),
    id: docSnap.id,
  }
}

// Set firestore document by collection
export async function set(col: string, document: Document): Promise<void> {
  return await setDoc(doc(collection(firestoreDb, col)), document, { merge: true })
}

// Update firestore document by collection and id
export async function update(col: string, id: string, key: string, value: Value) {
  const docRef = doc(firestoreDb, col, id)
  // Set the "key" field of the document
  return await updateDoc(docRef, {
    [key]: value,
  })
}

// Add firestore document by collection
export async function add(col: string, document: Document) {
  const colRef = collection(firestoreDb, col)
  const docRef = await addDoc(colRef, document)
  return docRef
}

// Delete firestore document by collection and id
export async function del(col: string, id: string) {
  const docRef = doc(firestoreDb, col, id)
  return await deleteDoc(docRef)
}
