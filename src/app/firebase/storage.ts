// src/app/firebase/storage.ts
import { storage } from './firebase-config';
import { 
  ref, uploadBytes, getDownloadURL, 
  deleteObject, listAll, StorageReference 
} from 'firebase/storage';

// Función para subir un archivo
export async function uploadFile(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
}

// Función para eliminar un archivo
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Función para listar archivos en un directorio
export async function listFiles(directory: string): Promise<string[]> {
  const storageRef = ref(storage, directory);
  const files = await listAll(storageRef);
  
  return Promise.all(
    files.items.map(fileRef => getDownloadURL(fileRef))
  );
}

// Función para obtener una referencia a un archivo
export function getFileRef(path: string): StorageReference {
  return ref(storage, path);
}