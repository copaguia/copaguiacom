import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, writeBatch, getCountFromServer } from 'firebase/firestore';
import { NegocioInterface } from '../../interfaces/negocio-interface';

@Injectable({
  providedIn: 'root'
})
export class AdminBorradorService {
  private firestore = inject(InstanciaFirebase).firestore;

  /**
   * Obtiene todos los negocios en la colección negocios_borrador que están pendientes de revisión.
   */
  public async obtenerBorradoresPendientes(): Promise<any[]> {
    const borradorRef = collection(this.firestore, 'negocios_borrador');
    const q = query(borradorRef, where('revisionManual', '==', 'Pendiente'));
    
    try {
      const querySnapshot = await getDocs(q);
      const borradores: any[] = [];
      querySnapshot.forEach((doc) => {
        borradores.push({ id: doc.id, ...doc.data() });
      });
      return borradores;
    } catch (error) {
      console.error("Error al obtener borradores pendientes:", error);
      throw error;
    }
  }

  /**
   * Obtiene la cantidad de negocios en un estado específico.
   */
  public async obtenerConteo(estado: 'Pendiente' | 'Aprobado'): Promise<number> {
    const borradorRef = collection(this.firestore, 'negocios_borrador');
    const q = query(borradorRef, where('revisionManual', '==', estado));
    
    try {
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error(`Error al obtener conteo de ${estado}:`, error);
      return 0;
    }
  }

  /**
   * Obtiene un documento específico de negocios_borrador por su ID.
   */
  public async obtenerBorrador(id: string): Promise<any | null> {
    const docRef = doc(this.firestore, 'negocios_borrador', id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el borrador:", error);
      throw error;
    }
  }

  /**
   * Aprueba un borrador:
   * 1. Guarda los datos validados en la colección 'negocios' (Público).
   * 2. Actualiza el documento en 'negocios_borrador' a revisionManual: "Aprobado".
   */
  public async aprobarBorrador(id: string, datosValidados: Partial<NegocioInterface>, aprobadoPor: { uid: string, email: string }): Promise<void> {
    const batch = writeBatch(this.firestore);

    // 1. Escribir en la colección pública (si no existe, se crea; si existe, se actualiza)
    const negocioPublicoRef = doc(this.firestore, 'negocios', id);
    // Aseguramos que tenga su ID dentro del payload si tu interfaz lo requiere
    const payloadPublico = { ...datosValidados, id };
    batch.set(negocioPublicoRef, payloadPublico, { merge: true });

    // 2. Actualizar el estado en la colección de borradores
    const borradorRef = doc(this.firestore, 'negocios_borrador', id);
    batch.update(borradorRef, { 
      revisionManual: 'Aprobado',
      fechaAprobacion: new Date().toISOString(),
      aprobadoPorUid: aprobadoPor.uid,
      aprobadoPorEmail: aprobadoPor.email
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error en la transacción de aprobación:", error);
      throw error;
    }
  }
}
