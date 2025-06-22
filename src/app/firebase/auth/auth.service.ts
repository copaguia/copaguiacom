// src/app/services/auth.service.ts
import { Injectable, inject, signal, Signal } from '@angular/core'; 
import { Router } from '@angular/router';
import {  GoogleAuthProvider,  User,  browserLocalPersistence,  onAuthStateChanged,  setPersistence,  signInWithPopup,  signOut} from 'firebase/auth';
import {  collection,  doc,  getDoc,  getDocs,  query,  setDoc,  where,  runTransaction,  orderBy,  Firestore // Asegúrate de que el tipo Firestore esté disponible si lo usas
} from 'firebase/firestore';

// Importa las instancias de Firebase que inicializaste globalmente en app.config.ts
import { auth, firestore, firebaseAppId } from '../../app.config'; 


// --- Interfaces Moviadas aquí ---
// Interfaz para el perfil público del usuario
export interface PublicUserProfile {
  uid: string;
  username: string; 
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  lastActive?: string; 
  createdAt: string; 
}

// Interfaz para un post básico (si planeas mostrar posts en el feed)
export interface Post {
  id: string;
  userId: string;
  username: string;
  imageUrl: string;
  caption: string;
  timestamp: any; // Firebase Timestamp (puede ser Date si lo conviertes)
  likesCount?: number;
  commentsCount?: number;
}
// ---------------------------------


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals para el estado de autenticación y perfil público
  private _user = signal<User | null | undefined>(undefined); 
  public user: Signal<User | null | undefined> = this._user.asReadonly(); 
  
  private _publicUserProfile = signal<PublicUserProfile | null>(null);
  public publicUserProfile: Signal<PublicUserProfile | null> = this._publicUserProfile.asReadonly();

  private router = inject(Router);

  constructor() {
    console.log('AuthService (Consolidado): Usando instancias de Firebase inicializadas globalmente.');
    console.log('AuthService (Consolidado): Firebase Project ID:', firebaseAppId);
    this.initAuthListener();
  }

  /**
   * Inicializa el listener de estado de autenticación de Firebase.
   * Configura la persistencia y actualiza las Signals de usuario y perfil.
   */
  private async initAuthListener(): Promise<void> {
    try {
      await setPersistence(auth, browserLocalPersistence); 
      console.log('AuthService (Consolidado): Persistencia de autenticación configurada a browserLocalPersistence.');

      onAuthStateChanged(auth, async (user) => { 
        this._user.set(user); 
        if (user) {
          console.log('AuthService (Consolidado): Usuario autenticado detectado:', user.uid);
          // Cargar el perfil público del usuario
          try {
            const publicProfile = await this.getProfileByUid(user.uid); // Usar el método interno del servicio
            if (publicProfile) {
              this._publicUserProfile.set(publicProfile); 
              console.log('AuthService (Consolidado): Perfil público cargado:', publicProfile.username);
            } else {
              this._publicUserProfile.set(null); 
              console.log('AuthService (Consolidado): No se encontró perfil público para el usuario.');
            }
          } catch (error) {
            console.error('AuthService (Consolidado): Error al cargar el perfil público en initAuthListener:', error);
            this._publicUserProfile.set(null); 
          }
        } else {
          this._publicUserProfile.set(null); 
          console.log('AuthService (Consolidado): Usuario desautenticado.');
        }
      });

    } catch (error) {
      console.error('AuthService (Consolidado): Error durante la inicialización de autenticación o persistencia:', error);
      this._user.set(null); 
      this._publicUserProfile.set(null);
    }
  }

  /**
   * Inicia el proceso de autenticación con Google mediante un pop-up.
   * @returns {Promise<User>} Una promesa que se resuelve con el objeto User autenticado en caso de éxito.
   * @throws {Error} Lanza un error si la autenticación falla por alguna razón.
   */
  async loginWithGoogle(): Promise<User> { 
    const provider = new GoogleAuthProvider();
    provider.addScope('profile'); 
    provider.addScope('email');   

    try {
      const result = await signInWithPopup(auth, provider); 
      const user = result.user; 
      
      if (!user.email) {
        throw new Error('No se pudo obtener el email del usuario de Google.');
      }
      console.log('AuthService (Consolidado): Login con Google exitoso:', user.uid);
      return user; 
    } catch (error: any) { 
      console.error('AuthService (Consolidado): Error en loginWithGoogle:', error);
      let errorMessage: string;
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Inicio de sesión cancelado. La ventana emergente fue cerrada.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes e intente nuevamente.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'La solicitud de autenticación fue cancelada.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Ya existe una cuenta con el mismo email pero con diferente proveedor de autenticación.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'El dominio de la aplicación no está autorizado para operaciones OAuth.';
          break;
        default:
          errorMessage = `Error al iniciar sesión: ${error.message || 'Ha ocurrido un error desconocido'}`;
      }
      throw new Error(errorMessage); 
    }
  }

  /**
   * Cierra la sesión del usuario actual en Firebase.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la sesión ha sido cerrada.
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth); 
      console.log('AuthService (Consolidado): Sesión cerrada.');
      this.router.navigate(['/login']); 
    } catch (error) {
      console.error('AuthService (Consolidado): Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión. Intente nuevamente.');
    }
  }

  /**
   * Obtiene el UID (User ID) del usuario actual de Firebase.
   * @returns {string | null} El UID del usuario autenticado o `null` si no hay usuario.
   */
  getCurrentUserId(): string | null {
    return auth.currentUser ? auth.currentUser.uid : null; 
  }


  // --- Métodos de Gestión de Perfil de Usuario (Movidos de UserProfileService) ---

  /**
   * Obtiene el perfil público de un usuario por su UID.
   * @param uid El UID del usuario.
   * @returns {Promise<PublicUserProfile | null>} El perfil público o null si no existe.
   */
  async getProfileByUid(uid: string): Promise<PublicUserProfile | null> {
    try {
      const profileDocRef = doc(firestore, `userProfiles`, uid); 
      const profileSnap = await getDoc(profileDocRef);
      if (profileSnap.exists()) {
        console.log(`AuthService (Consolidado): Perfil encontrado para UID ${uid}`);
        return profileSnap.data() as PublicUserProfile;
      }
      console.log(`AuthService (Consolidado): No se encontró perfil para UID ${uid}`);
      return null;
    } catch (error) {
      console.error(`AuthService (Consolidado): Error al obtener perfil por UID ${uid}:`, error);
      throw new Error('Error al obtener el perfil de usuario.');
    }
  }

  /**
   * Obtiene el perfil público de un usuario por su username.
   * @param username El nombre de usuario.
   * @returns {Promise<PublicUserProfile | null>} El perfil público o null si no existe.
   */
  async getProfileByUsername(username: string): Promise<PublicUserProfile | null> {
    try {
      const q = query(
        collection(firestore, `userProfiles`), 
        where('username', '==', username)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log(`AuthService (Consolidado): Perfil encontrado para username ${username}`);
        return querySnapshot.docs[0].data() as PublicUserProfile;
      }
      console.log(`AuthService (Consolidado): No se encontró perfil para username ${username}`);
      return null;
    } catch (error) {
      console.error(`AuthService (Consolidado): Error al obtener perfil por username ${username}:`, error);
      throw new Error('Error al obtener el perfil de usuario.');
    }
  }

  /**
   * Verifica si un username ya existe en la base de datos.
   * @param username El nombre de usuario a verificar.
   * @returns {Promise<boolean>} True si el username ya existe, false en caso contrario.
   */
  async isUsernameTaken(username: string): Promise<boolean> {
    try {
      const normalizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

      const q = query(
        collection(firestore, `userProfiles`), 
        where('username', '==', normalizedUsername)
      );
      const querySnapshot = await getDocs(q);
      const isTaken = !querySnapshot.empty;
      console.log(`AuthService (Consolidado): Username "${username}" (normalized: "${normalizedUsername}") taken: ${isTaken}`);
      return isTaken;
    } catch (error) {
      console.error(`AuthService (Consolidado): Error al verificar la unicidad del username "${username}":`, error);
      throw new Error('Error al verificar la unicidad del nombre de usuario.');
    }
  }

  /**
   * Crea o actualiza un perfil público de usuario con un username.
   * Utiliza una transacción para asegurar la unicidad del username si es un perfil nuevo.
   * @param user El objeto User de Firebase (proveniente de la autenticación).
   * @param username El username deseado por el usuario.
   * @returns {Promise<PublicUserProfile>} El perfil público creado o actualizado.
   */
  async createUserProfile(user: User, username: string): Promise<PublicUserProfile> {
    const uid = user.uid;
    const normalizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

    if (!normalizedUsername) {
      throw new Error('El nombre de usuario no puede estar vacío o contener solo caracteres especiales.');
    }

    try {
      const newProfile: PublicUserProfile = {
        uid: uid,
        username: normalizedUsername,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        bio: '', 
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await runTransaction(firestore, async (transaction) => { 
        const userProfileRef = doc(firestore, `userProfiles`, uid); 
        const userProfileSnap = await transaction.get(userProfileRef);

        if (userProfileSnap.exists()) {
          const existingProfile = userProfileSnap.data() as PublicUserProfile;
          if (!existingProfile.username || existingProfile.username !== normalizedUsername) {
            transaction.update(userProfileRef, { username: normalizedUsername, lastActive: newProfile.lastActive });
            console.log(`AuthService (Consolidado): Perfil existente para ${uid} actualizado con nuevo username: ${normalizedUsername}`);
          } else {
            transaction.update(userProfileRef, { lastActive: newProfile.lastActive });
            console.log(`AuthService (Consolidado): Perfil existente para ${uid} actualizado solo lastActive.`);
          }
        } else {
          const qCheck = query(
            collection(firestore, `userProfiles`), 
            where('username', '==', normalizedUsername)
          );
          const existingUsernameSnap = await getDocs(qCheck);

          if (!existingUsernameSnap.empty) {
            throw new Error('El nombre de usuario ya está en uso. Por favor, elige otro.');
          }

          transaction.set(userProfileRef, newProfile);
          console.log(`AuthService (Consolidado): Nuevo perfil público creado para ${uid} con username: ${normalizedUsername}`);
        }
      });
      return newProfile; 
    } catch (error: any) {
      console.error(`AuthService (Consolidado): Error al crear o actualizar perfil para UID ${uid}:`, error);
      throw new Error(error.message || 'Error al guardar el perfil de usuario.');
    }
  }

  /**
   * Actualiza la fecha de última actividad de un perfil de usuario.
   * @param uid El UID del usuario.
   */
  async updateLastActive(uid: string): Promise<void> {
    try {
      const profileDocRef = doc(firestore, `userProfiles`, uid); 
      await setDoc(profileDocRef, { lastActive: new Date().toISOString() }, { merge: true });
      console.log(`AuthService (Consolidado): lastActive actualizado para UID ${uid}`);
    } catch (error) {
      console.error(`AuthService (Consolidado): Error al actualizar lastActive para UID ${uid}:`, error);
    }
  }

  /**
   * Obtiene los posts de un usuario específico por su UID.
   * @param userId El UID del usuario.
   * @returns {Promise<Post[]>} Una lista de posts del usuario.
   */
  async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const postsCollectionRef = collection(firestore, `posts`); 
      const q = query(postsCollectionRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const posts: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Post, 'id'> 
      }));
      console.log(`AuthService (Consolidado): Posts encontrados para UID ${userId}:`, posts.length);
      return posts;
    } catch (error) {
      console.error(`AuthService (Consolidado): Error al obtener posts para UID ${userId}:`, error);
      throw new Error('Error al cargar las publicaciones del usuario.');
    }
  }
}
