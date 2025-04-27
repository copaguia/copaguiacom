// src/app/firebase/auth.ts
import { auth } from './firebase-config';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, updateProfile,
  User, UserCredential 
} from 'firebase/auth';

// Función para iniciar sesión
export async function loginWithEmail(
  email: string, 
  password: string
): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Función para registrar un nuevo usuario
export async function registerWithEmail(
  email: string, 
  password: string
): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Función para cerrar sesión
export async function logout(): Promise<void> {
  return await signOut(auth);
}

// Función para enviar email de recuperación de contraseña
export async function resetPassword(email: string): Promise<void> {
  return await sendPasswordResetEmail(auth, email);
}

// Función para actualizar perfil de usuario
export async function updateUserProfile(
  displayName?: string | null, 
  photoURL?: string | null
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No hay usuario autenticado');
  
  return await updateProfile(user, { displayName, photoURL });
}

// Obtener usuario actual
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Observable para cambios en el estado de autenticación
export function getAuthState() {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    });
  });
}