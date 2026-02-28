import { Injectable, inject, signal } from '@angular/core';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { AuthService } from './auth.service';
import { RolUsuario } from './rol-usuario';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NegocioVerificationService {

  private firestore   = inject(InstanciaFirebase).firestore;
  private authService = inject(AuthService);

  public tieneNegocio = signal<boolean>(false);
  public negocioId    = signal<string | null>(null);
  public estaVerificando = signal<boolean>(true);

  constructor() {
    this.verificarNegocioUsuarioActual();
  }

  private verificarNegocioUsuarioActual() {
    this.authService.usuarioLogueado$.pipe(take(1)).subscribe(usuario => {
      if (usuario && usuario.rol === RolUsuario.DUENO) {
        const uid = usuario.uid;
        const q = query(collection(this.firestore, 'negocios'), where('duenoId', '==', uid));
        
        getDocs(q).then(querySnapshot => {
          if (!querySnapshot.empty) {
            const negocioDoc = querySnapshot.docs[0];
            this.tieneNegocio.set(true);
            this.negocioId.set(negocioDoc.id);
          } else {
            this.tieneNegocio.set(false);
            this.negocioId.set(null);
          }
          this.estaVerificando.set(false);
        });
      } else {
        this.estaVerificando.set(false);
      }
    });
  }

  // Método para forzar una re-verificación si es necesario
  public forzarReverificacion() {
    this.estaVerificando.set(true);
    this.verificarNegocioUsuarioActual();
  }
}
