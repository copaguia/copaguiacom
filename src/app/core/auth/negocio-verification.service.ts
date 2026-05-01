import { Injectable, inject, signal, effect } from '@angular/core';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { AuthService } from './auth.service';
import { RolUsuario } from './rol-usuario';

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
    effect(() => {
      this.estaVerificando.set(true);
      const perfil = this.authService.perfilLectura();

      if (perfil && perfil.rolUsuario === RolUsuario.DUENO) {
        const uid = perfil.id;
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
        }).catch(error => {
            console.error("Error al verificar el negocio:", error);
            this.tieneNegocio.set(false);
            this.negocioId.set(null);
            this.estaVerificando.set(false);
        });
      } else {
        this.tieneNegocio.set(false);
        this.negocioId.set(null);
        this.estaVerificando.set(false);
      }
    });
  }
}
