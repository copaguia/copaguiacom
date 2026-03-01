import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AnaliticaService {

  private firestore = inject(InstanciaFirebase).firestore;

  public async registrarEvento(negocioId: string, tipoEvento: 'visita' | 'clic_wa' | 'conversion'): Promise<void> {
    const metricaRef = doc(this.firestore, `negocios/${negocioId}/metricas/resumen`);
    const logRef     = collection(this.firestore, `negocios/${negocioId}/logs_actividad`);

    // 1. Incremento atómico para contadores rápidos (Dashboard)
    await updateDoc(metricaRef, {
      [tipoEvento]: increment(1),
      ultimaActualizacion: serverTimestamp()
    }).catch(async () => {
      // Si el doc no existe, lo inicializamos (setDoc)
    });

    // 2. Registro detallado para auditoría futura
    await addDoc(logRef, {
      tipo:   tipoEvento,
      fecha:  serverTimestamp(),
      plataforma: 'web-lidertech'
    });
  }
  
}
