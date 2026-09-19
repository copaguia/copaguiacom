import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, writeBatch, getCountFromServer, QueryConstraint } from 'firebase/firestore';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { AuthService } from '../auth/auth.service';
import { RolUsuario } from '../auth/rol-usuario';

@Injectable({
  providedIn: 'root'
})
export class AdminBorradorService {
  private firestore = inject(InstanciaFirebase).firestore;
  private authService = inject(AuthService);

  private getFiltrosPorRol(): QueryConstraint[] {
    const perfil = this.authService.perfilLectura();
    const constraints: QueryConstraint[] = [];
    
    // Si es AGENTE y tiene zonas asignadas, filtramos obligatoriamente por esas zonas.
    if (perfil?.rolUsuario === RolUsuario.AGENTE && perfil.zonasAsignadas && perfil.zonasAsignadas.length > 0) {
      // Nota: Firestore permite 'in' hasta 10 elementos. 
      constraints.push(where('zonaAsignada', 'in', perfil.zonasAsignadas));
    }
    
    return constraints;
  }

  /**
   * Obtiene todos los negocios en la colección negocios_borrador que están pendientes de revisión.
   */
  public async obtenerBorradoresPendientes(): Promise<any[]> {
    const borradorRef = collection(this.firestore, 'negocios_borrador');
    const q = query(borradorRef, where('revisionManual', '==', 'Pendiente'), ...this.getFiltrosPorRol());
    
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
    const q = query(borradorRef, where('revisionManual', '==', estado), ...this.getFiltrosPorRol());
    
    try {
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error(`Error al obtener conteo de ${estado}:`, error);
      return 0;
    }
  }

  /**
   * Obtiene el ranking de validadores calculando la cantidad de negocios aprobados por cada email.
   * Retorna un arreglo de objetos ordenados por total.
   */
  public async obtenerRankingValidadores(): Promise<Array<{ email: string; total: number; ultimaFecha: string }>> {
    const borradorRef = collection(this.firestore, 'negocios_borrador');
    const q = query(borradorRef, where('revisionManual', '==', 'Aprobado'), ...this.getFiltrosPorRol());
    
    try {
      const querySnapshot = await getDocs(q);
      const conteoMap = new Map<string, { total: number; ultimaFecha: string }>();

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const email = data['aprobadoPorEmail'];
        const fechaStr = data['fechaAprobacion'];
        
        if (email) {
          const actual = conteoMap.get(email) || { total: 0, ultimaFecha: '' };
          actual.total += 1;
          
          if (fechaStr && (!actual.ultimaFecha || new Date(fechaStr) > new Date(actual.ultimaFecha))) {
            actual.ultimaFecha = fechaStr;
          }
          
          conteoMap.set(email, actual);
        }
      });

      const ranking = Array.from(conteoMap.entries()).map(([email, stats]) => {
        return { email, total: stats.total, ultimaFecha: stats.ultimaFecha };
      });

      return ranking.sort((a, b) => b.total - a.total);
    } catch (error) {
      console.error("Error al obtener ranking de validadores:", error);
      return [];
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
