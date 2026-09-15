import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { doc, updateDoc } from 'firebase/firestore';
import { NegocioInterface } from '../../interfaces/negocio-interface';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {
  private firestore = inject(InstanciaFirebase).firestore;

  public async actualizarNegocio(id: string, data: Partial<NegocioInterface>): Promise<void> {
    const negocioRef = doc(this.firestore, `negocios/${id}`);
    await updateDoc(negocioRef, data);
  }
}
