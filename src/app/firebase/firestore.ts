// src/app/firebase/firestore.ts
import { firestore} from './firebase-config';
import { 
  collection, getDocs, query, where, orderBy, 
  addDoc, updateDoc, deleteDoc, doc, getDoc,
  DocumentData, QueryConstraint, DocumentReference 
} from 'firebase/firestore';

// Tipos para mejorar la seguridad de tipos
export type CollectionName = 'Negocios' | 'Usuarios' | 'Pedidos'; // Definir todas las colecciones

// Función genérica para obtener documentos filtrados
export async function getDocumentsByField<T = DocumentData>(
  collectionName: CollectionName,
  field: string,
  value: any,
  additionalConstraints: QueryConstraint[] = []
): Promise<T[]> {
  const constraints = [where(field, '==', value), ...additionalConstraints];
  const q = query(collection(firestore, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  } as unknown as T));
}

// Función para crear un nuevo documento
export async function createDocument<T>(
  collectionName: CollectionName,
  data: Omit<T, 'id'>
): Promise<string> {
  const docRef = await addDoc(collection(firestore, collectionName), data);
  return docRef.id;
}

// Función para actualizar un documento
export async function updateDocument<T>(
  collectionName: CollectionName,
  id: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(firestore, collectionName, id);
  await updateDoc(docRef, data as DocumentData);
}

// Función para eliminar un documento
export async function deleteDocument(
  collectionName: CollectionName,
  id: string
): Promise<void> {
  const docRef = doc(firestore, collectionName, id);
  await deleteDoc(docRef);
}

// Función para obtener un documento por ID
export async function getDocumentById<T = DocumentData>(
  collectionName: CollectionName,
  id: string
): Promise<T | null> {
  const docRef = doc(firestore, collectionName, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return { 
    id: snapshot.id, 
    ...snapshot.data() 
  } as unknown as T;
}

// Función para obtener una referencia de documento
export function getDocRef(
  collectionName: CollectionName,
  id: string
): DocumentReference {
  return doc(firestore, collectionName, id);
}