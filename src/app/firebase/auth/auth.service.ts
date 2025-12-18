// src/app/services/auth.service.ts
import { Injectable, inject, signal, Signal } from '@angular/core'; 
import { Router } from '@angular/router';
import {  GoogleAuthProvider,  User,  browserLocalPersistence,  onAuthStateChanged,  setPersistence,  signInWithPopup,  signOut} from 'firebase/auth';
import {  collection,  doc,  getDoc,  getDocs,  query,  setDoc,  where,  runTransaction,  orderBy } from 'firebase/firestore';


import { PerfilInterface, RolUsuario } from '../../interfaces/perfil-interface';
import { InstanciaFirebase } from '../instancias.service';



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private instancias = inject(InstanciaFirebase);
  
  private router = inject(Router);

  private usuarioEscritura = signal<User | null | undefined>(undefined); 
  public usuarioLectura: Signal<User | null | undefined> = this.usuarioEscritura.asReadonly(); 
  
  private perfilEscritura = signal<PerfilInterface | null>(null);
  public perfilLectura: Signal<PerfilInterface | null> = this.perfilEscritura.asReadonly();

  

  readonly nombreColeccion = signal<string>('Usuarios');  


  constructor() { this.monitorAutenticacion(); }








  // 1. Monitorea la autenticacion y mantiene la persistencia.
  private async monitorAutenticacion(): Promise<void> {
    try {
      await setPersistence(this.instancias.auth, browserLocalPersistence); console.log(' Persistencia de autenticación .');

      onAuthStateChanged(this.instancias.auth, async (usuarioActual) => {
        this.usuarioEscritura.set(usuarioActual);
        if (usuarioActual) {     console.log(' Usuario autenticado detectado:', usuarioActual.uid);
          try {
            let publicProfile = await this.obtenerPerfilUsuario(usuarioActual.uid); 
            if (publicProfile) {
              this.perfilEscritura.set(publicProfile);    console.log(' Perfil público cargado:', publicProfile.nombreUsuario);
            } else {    console.log(' Perfil no encontrado para el usuario. Creando perfil CONSUMER por defecto.');
              const defaultnombreUsuario = usuarioActual.email ? usuarioActual.email.split('@')[0] : `user_${usuarioActual.uid.substring(0, 8)}`;
              publicProfile = await this.creaNuevoPerfil(usuarioActual, defaultnombreUsuario);
              this.perfilEscritura.set(publicProfile);    console.log(' Nuevo perfil CONSUMER creado y cargado.');
            }
          } catch (error) {     console.error(' Error al cargar o crear perfil público en initAuthListener:', error); this.perfilEscritura.set(null); }
        } 
        else { this.perfilEscritura.set(null);    console.log(' Usuario desautenticado.');}
      });

    } 
    catch (error) {     console.error(' Error durante la inicialización de autenticación o persistencia:', error); this.usuarioEscritura.set(null); this.perfilEscritura.set(null); }
  }












  // 2. Para el boton de Login con Goole.
  async loginConGoogle(): Promise<User> { 
    const proveedorGoogle = new GoogleAuthProvider(); proveedorGoogle.addScope('profile'); proveedorGoogle.addScope('email');   

    try {
      const usuarioActual = (await signInWithPopup(this.instancias.auth, proveedorGoogle)).user; // obtiene credenciales mas propiedad user
      
      if (!usuarioActual.email) { throw new Error('No se pudo obtener el email del usuario de Google.'); }     console.log(' Login con Google exitoso:', usuarioActual.uid); return usuarioActual; 
    } 
    catch (error: any) {    console.error(' Error en loginWithGoogle:', error);
      let mensajeError: string;
      switch (error.code) {
        case 'auth/popup-closed-by-user': mensajeError = 'Inicio de sesión cancelado. La ventana emergente fue cerrada.';
          break;
        case 'auth/popup-blocked': mensajeError = 'El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes e intente nuevamente.';
          break;
        case 'auth/cancelled-popup-request': mensajeError = 'La solicitud de autenticación fue cancelada.';
          break;
        case 'auth/account-exists-with-different-credential': mensajeError = 'Ya existe una cuenta con el mismo email pero con diferente proveedor de autenticación.';
          break;
        case 'auth/unauthorized-domain': mensajeError = 'El dominio de la aplicación no está autorizado para operaciones OAuth.';
          break;
        default: mensajeError = `Error al iniciar sesión: ${error.message || 'Ha ocurrido un error desconocido'}`;
      }
      throw new Error(mensajeError); 
    }
  }















  // Se desloguea
  async desloguear(): Promise<void> {
    try { await signOut(this.instancias.auth); console.log(' Sesión cerrada.'); this.router.navigate(['/login']); } 
    catch (error) {console.error(' Error al cerrar sesión:', error); throw new Error('Error al cerrar sesión. Intente nuevamente.');}
  }














 // Obtiene el ID del usuario actual.
  obtenerIdentificadorUsuario(): string | null { return this.instancias.auth.currentUser ? this.instancias.auth.currentUser.uid : null; }















  // Obtiene el perfir por su Identificador.
  async obtenerPerfilUsuario(idUsuario: string): Promise<PerfilInterface | null> {
    try {
      const profileDocRef = doc(this.instancias.firestore, this.nombreColeccion() , idUsuario); 
      const profileSnap = await getDoc(profileDocRef);
      if (profileSnap.exists()) { console.log(` Perfil encontrado para UID ${idUsuario}`); return profileSnap.data() as PerfilInterface; } console.log(` No se encontró perfil para UID ${idUsuario}`); return null;
    } 
    catch (error) { console.error(` Error al obtener perfil por UID ${idUsuario}:`, error); throw new Error('Error al obtener el perfil de usuario.');}
  }













 
  async obtenerPerfilPorNombreUsuario( nombreUsuario: string ): Promise<PerfilInterface | null> {
    try { const q = query( collection( this.instancias.firestore, this.nombreColeccion() ), where('nombreUsuario', '==', nombreUsuario ));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {console.log(` Perfil encontrado para nombreUsuario ${nombreUsuario}`); return querySnapshot.docs[0].data() as PerfilInterface;} console.log(` No se encontró perfil para nombreUsuario ${nombreUsuario}`);return null;} 
    catch (error) { console.error(` Error al obtener perfil por nombreUsuario ${nombreUsuario}:`, error); throw new Error('Error al obtener el perfil de usuario.');}
  }

  












  
  async verificaNombreUsuario(nombreUsuario: string): Promise<boolean> {
    try {
      const nombreUsuarioLimpio = nombreUsuario.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
      const consultaNombreUsuario = query( collection(this.instancias.firestore, this.nombreColeccion() ), where('nombreUsuario', '==', nombreUsuarioLimpio));
      const resultadosBusqueda = await getDocs(consultaNombreUsuario);
      const nombreNoDisponible = !resultadosBusqueda.empty; console.log(` nombreUsuario "${nombreUsuario}" ( normalized: "${nombreUsuarioLimpio}") taken: ${nombreNoDisponible}`);
      return nombreNoDisponible;

    } 
    catch (error) { console.error(` Error al verificar la unicidad del nombreUsuario "${nombreUsuario}":`, error); throw new Error('Error al verificar la unicidad del nombre de usuario.');}
  }








  
  async creaNuevoPerfil( user: User, nombreUsuario: string ): Promise<PerfilInterface> {
    const idUsuario = user.uid;
   
    const nombreUsuarioLimpio = nombreUsuario.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
  
    if (!nombreUsuarioLimpio) { throw new Error('El nombre de usuario no puede estar vacío o contener solo caracteres especiales.'); }
  
    try {
     
      const nuevoPerfil: PerfilInterface = {
        id: idUsuario, nombreUsuario: nombreUsuarioLimpio, email: user.email || '', nombreMostrado: user.displayName || '', urlFoto: user.photoURL || '',
        biografia: '', ultimaActividad: new Date().toISOString(), fechaCreacion: new Date().toISOString(), rolUsuario: RolUsuario.USUARIO 
      };
  
      // 3. Verifica la unicidad del nombreUsuario AFUERA de la transacción
      const consultaVerificacion = query( collection(this.instancias.firestore, this.nombreColeccion()), where('nombreUsuario', '==', nombreUsuarioLimpio));
      const nombreExistente = await getDocs(consultaVerificacion);
  
      // Si el nombreUsuario ya existe Y pertenece a un UID *diferente* al actual, lanza un error.
      if (!nombreExistente.empty && nombreExistente.docs[0].id !== idUsuario) { throw new Error('El nombre de usuario ya está en uso. Por favor, elige otro.'); }
  
      // 4. Ejecuta la transacción para escribir los datos de forma segura
      await runTransaction( this.instancias.firestore, async (transaction) => {
        const referenciaUsuario = doc( this.instancias.firestore, this.nombreColeccion(), idUsuario);
        const fotoDelPerfil = await transaction.get(referenciaUsuario);
  
        if (fotoDelPerfil.exists()) {
          const perfilExistente = fotoDelPerfil.data() as PerfilInterface;
          
          if (!perfilExistente.nombreUsuario || perfilExistente.nombreUsuario !== nombreUsuarioLimpio) {
            transaction.update(referenciaUsuario, { nombreUsuario: nombreUsuarioLimpio, ultimaActividad: nuevoPerfil.ultimaActividad }) } 
          else { transaction.update(referenciaUsuario, { ultimaActividad: nuevoPerfil.ultimaActividad }); }
          
        } 
        else {
          transaction.set(referenciaUsuario, nuevoPerfil);    console.log(` Nuevo perfil público creado para ${idUsuario} con nombreUsuario: ${nombreUsuarioLimpio}, tipo: ${nuevoPerfil.rolUsuario}`);
        }
      });
      
      return nuevoPerfil;
  
    } catch (error: any) { console.error(` Error al crear o actualizar perfil para UID ${idUsuario}:`, error); throw new Error(error.message || 'Error al guardar el perfil de usuario.'); }
}

  









  async guardaUltimaSesion(idUsuario: string): Promise<void> {
    try { const referenciaUsuario = doc( this.instancias.firestore, this.nombreColeccion() , idUsuario); 
      await setDoc(referenciaUsuario, { ultimaActividad: new Date().toISOString() }, { merge: true }); console.log(` ultimaActividad actualizado para UID ${idUsuario}`);} 
    catch (error) { console.error(` Error al actualizar ultimaActividad para UID ${idUsuario}:`, error); }
  }


  
 
}
