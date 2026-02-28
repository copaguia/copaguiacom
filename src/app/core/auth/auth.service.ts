import { Injectable, inject, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider, User, browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, where, runTransaction } from 'firebase/firestore';
import { RolUsuario } from '../auth/rol-usuario';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { PerfilInterface } from '../../interfaces/perfil-interface';
import { StateEnum } from '../../enums/state.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth                 = inject(InstanciaFirebase).auth;
  private firestore            = inject(InstanciaFirebase).firestore;
  private router               = inject(Router);

  private usuarioEscritura     = signal<User | null>(null);
  public  usuarioLectura       = this.usuarioEscritura.asReadonly();

  private perfilEscritura      = signal<PerfilInterface | null>(null);
  public  perfilLectura        = this.perfilEscritura.asReadonly();

  public  estado               = signal<StateEnum>(StateEnum.INICIAL);
  readonly nombreColeccion     = signal<string>('Usuarios');

  constructor() {
    this.monitorAutenticacion();
  }

  private async monitorAutenticacion(): Promise<void> {
  try {
    const persistenciaNavegador = browserLocalPersistence;
    
    await setPersistence(this.auth, persistenciaNavegador);

    onAuthStateChanged(this.auth, async (usuarioActual) => {
      this.usuarioEscritura.set(usuarioActual);
      
      if (usuarioActual) {
        const idUsuarioActual = usuarioActual.uid;
        this.estado.set(StateEnum.CARGANDO);
        
      try {
        let perfilPublico = await this.obtenerPerfilUsuario(idUsuarioActual);
        
        if (perfilPublico) {
          this.perfilEscritura.set(perfilPublico);
          this.estado.set(StateEnum.EXITO);
        } else {
          const correoUsuario    = usuarioActual.email;
          const extraccionCorreo = correoUsuario ? correoUsuario.split('@')[0] : `user_${idUsuarioActual.substring(0, 8)}`;
          
          perfilPublico = await this.creaNuevoPerfil(usuarioActual, extraccionCorreo);
          this.perfilEscritura.set(perfilPublico);
          this.estado.set(StateEnum.EXITO);
        }
      }
      catch (error) {
        this.perfilEscritura.set(null);
        this.estado.set(StateEnum.ERROR);
      }
      } else {
        this.perfilEscritura.set(null);
        this.estado.set(StateEnum.INICIAL);
      }
    });
  }
  catch (error) {
    this.usuarioEscritura.set(null);
    this.perfilEscritura.set(null);
    this.estado.set(StateEnum.ERROR);
  }
  }

  async loginConGoogle(): Promise<User> {
    const proveedorGoogle = new GoogleAuthProvider();
    
    proveedorGoogle.addScope('profile');
    proveedorGoogle.addScope('email');
    proveedorGoogle.setCustomParameters({ prompt: 'select_account' });

  try {
    const respuestaAutenticacion = await signInWithPopup(this.auth, proveedorGoogle);
    const usuarioActual          = respuestaAutenticacion.user;
    const correoUsuario          = usuarioActual.email;

    if (!correoUsuario) {
      throw new Error('No se pudo obtener el email del usuario de Google.');
    }

    return usuarioActual;
  }
  catch (error: any) {
    const codigoError = error.code;
    const mensajeBase = error.message;
    let mensajeError  = '';

    switch (codigoError) {
      case 'auth/popup-closed-by-user':
        mensajeError = 'Inicio de sesión cancelado. La ventana emergente fue cerrada.';
        break;
      case 'auth/popup-blocked':
        mensajeError = 'El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes e intente nuevamente.';
        break;
      case 'auth/cancelled-popup-request':
        mensajeError = 'La solicitud de autenticación fue cancelada.';
        break;
      case 'auth/account-exists-with-different-credential':
        mensajeError = 'Ya existe una cuenta con el mismo email pero con diferente proveedor de autenticación.';
        break;
      case 'auth/unauthorized-domain':
        mensajeError = 'El dominio de la aplicación no está autorizado para operaciones OAuth.';
        break;
      default:
        mensajeError = `Error al iniciar sesión: ${mensajeBase || 'Ha ocurrido un error desconocido'}`;
    }
    
    throw new Error(mensajeError);
  }
  }

  async desloguear(): Promise<void> {
  try {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
  catch (error) {
    throw new Error('Error al cerrar sesión. Intente nuevamente.');
  }
  }

  obtenerIdentificadorUsuario(): string | null {
    const usuarioLogueado = this.auth.currentUser;
    return usuarioLogueado ? usuarioLogueado.uid : null;
  }

  async obtenerPerfilUsuario(idUsuario: string): Promise<PerfilInterface | null> {
  try {
    const coleccionActual   = this.nombreColeccion();
    const referenciaPerfil  = doc(this.firestore, coleccionActual, idUsuario);
    const instantaneaPerfil = await getDoc(referenciaPerfil);

    if (instantaneaPerfil.exists()) {
      return instantaneaPerfil.data() as PerfilInterface;
    }
    
    return null;
  }
  catch (error) {
    throw new Error('Error al obtener el perfil de usuario.');
  }
  }

  async obtenerPerfilPorNombreUsuario(nombreUsuario: string): Promise<PerfilInterface | null> {
  try {
    const coleccionActual  = this.nombreColeccion();
    const referenciaQuery  = query(collection(this.firestore, coleccionActual), where('nombreUsuario', '==', nombreUsuario));
    const instantaneaQuery = await getDocs(referenciaQuery);

    if (!instantaneaQuery.empty) {
      return instantaneaQuery.docs[0].data() as PerfilInterface;
    }
    
    return null;
  }
  catch (error) {
    throw new Error('Error al obtener el perfil de usuario.');
  }
  }

  private normalizarNombreUsuario(nombreUsuario: string): string {
    const nombreNormalizado = nombreUsuario.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    return nombreNormalizado;
  }

  async creaNuevoPerfil(usuario: User, nombreUsuario: string): Promise<PerfilInterface> {
    const idUsuario = usuario.uid;
    let nombreUsuarioFinal = this.normalizarNombreUsuario(nombreUsuario);

    if (!nombreUsuarioFinal) {
      throw new Error('El nombre de usuario base no es válido.');
    }

  try {
    let nombreOcupado   = true;
    let contador        = 0;
    const baseNombre    = nombreUsuarioFinal;
    const coleccionBase = this.nombreColeccion();

    while (nombreOcupado) {
      const consultaNombre    = query(collection(this.firestore, coleccionBase), where('nombreUsuario', '==', nombreUsuarioFinal));
      const resultadoConsulta = await getDocs(consultaNombre);
      
      if (resultadoConsulta.empty) {
        nombreOcupado = false;
      } else {
        contador++;
        nombreUsuarioFinal = `${baseNombre}_${contador}`;
      }
    }

    const nuevoPerfil: PerfilInterface = {
      id:              idUsuario,
      nombreUsuario:   nombreUsuarioFinal,
      email:           usuario.email || '',
      nombreMostrado:  usuario.displayName || '',
      urlFoto:         usuario.photoURL || '',
      fechaCreacion:   new Date().toISOString(),
      rolUsuario:      RolUsuario.LEAD,
      activo:      true
    };

    await runTransaction(this.firestore, async (transaccion) => {
      const referenciaUsuario = doc(this.firestore, coleccionBase, idUsuario);
      transaccion.set(referenciaUsuario, nuevoPerfil);
    });

    return nuevoPerfil;
  }
  catch (error: any) {
    const mensajeFallo = error.message || 'Error al guardar el perfil de usuario.';
    throw new Error(mensajeFallo);
  }
  }

  async guardaUltimaSesion(idUsuario: string): Promise<void> {
  try {
    const coleccionActual   = this.nombreColeccion();
    const referenciaUsuario = doc(this.firestore, coleccionActual, idUsuario);
    const fechaActual       = new Date().toISOString();
    
    await setDoc(referenciaUsuario, { ultimaActividad: fechaActual }, { merge: true });
  }
  catch (error) {
    throw new Error('Error al actualizar la ultima actividad');
  }
  }
}





// Fin del servicio AuthService