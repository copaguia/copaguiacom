import { Injectable, signal } from '@angular/core';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SoporteService {

  private firestore = getFirestore();
  public negocioSeleccionado = signal<any | null>(null);

  public async actualizarInformacionNegocio(negocioId: string, dataActualizada: any): Promise<void> {
    const negocioRef = doc(this.firestore, `negocios/${negocioId}`);
    await updateDoc(negocioRef, {
      ...dataActualizada,
      ultimaEdicionPor: 'ejecutivo_interno',
      fechaEdicion: new Date().toISOString()
    });
  }
  
}
