import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, query, where, getDocs, doc, getDoc, writeBatch, getCountFromServer, QueryConstraint } from 'firebase/firestore';
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
      constraints.push(where('zonaAsignada', 'in', perfil.zonasAsignadas));
    }
    
    return constraints;
  }

  /**
   * Obtiene todos los negocios en la colección "negocios" que NO están verificados.
   */
  public async obtenerBorradoresPendientes(): Promise<any[]> {
    const negociosRef = collection(this.firestore, 'negocios');
    const q = query(negociosRef, where('verificado', '==', false), ...this.getFiltrosPorRol());
    
    try {
      const querySnapshot = await getDocs(q);
      const borradores: any[] = [];
      querySnapshot.forEach((doc) => {
        borradores.push({ id: doc.id, ...doc.data() });
      });
      return borradores;
    } catch (error) {
      console.error("Error al obtener negocios no verificados:", error);
      throw error;
    }
  }

  /**
   * Obtiene la cantidad de negocios en un estado específico.
   * En este caso, mapeamos "Pendiente" a verificado=false y "Aprobado" a verificado=true.
   */
  public async obtenerConteo(estado: 'Pendiente' | 'Aprobado'): Promise<number> {
    const negociosRef = collection(this.firestore, 'negocios');
    const isVerificado = estado === 'Aprobado';
    const q = query(negociosRef, where('verificado', '==', isVerificado), ...this.getFiltrosPorRol());
    
    try {
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error(`Error al obtener conteo de ${estado}:`, error);
      return 0;
    }
  }

  /**
   * Obtiene el ranking de validadores calculando la cantidad de negocios verificados por cada email.
   * Retorna un arreglo de objetos ordenados por total.
   */
  public async obtenerRankingValidadores(): Promise<Array<{ email: string; total: number; ultimaFecha: string }>> {
    const negociosRef = collection(this.firestore, 'negocios');
    const q = query(negociosRef, where('verificado', '==', true), ...this.getFiltrosPorRol());
    
    try {
      const querySnapshot = await getDocs(q);
      const conteoMap = new Map<string, { total: number; ultimaFecha: string }>();

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const email = data['verificadoPorEmail']; // Campo nuevo
        const fechaStr = data['fechaVerificacion']; // Campo nuevo
        
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
   * Obtiene un documento específico de negocios por su ID.
   */
  public async obtenerBorrador(id: string): Promise<any | null> {
    const docRef = doc(this.firestore, 'negocios', id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el negocio:", error);
      throw error;
    }
  }

  /**
   * Verifica un negocio:
   * Como ya está en la colección pública ('negocios'), solo actualizamos el flag a verificado=true
   * y guardamos los datos del validador.
   */
  public async aprobarBorrador(id: string, datosValidados: Partial<NegocioInterface>, aprobadoPor: { uid: string, email: string }): Promise<void> {
    const batch = writeBatch(this.firestore);

    const negocioRef = doc(this.firestore, 'negocios', id);
    
    const payloadActualizado = { 
      ...datosValidados, 
      id,
      verificado: true,
      fechaVerificacion: new Date().toISOString(),
      verificadoPorUid: aprobadoPor.uid,
      verificadoPorEmail: aprobadoPor.email
    };
    
    batch.update(negocioRef, payloadActualizado);

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error en la transacción de validación:", error);
      throw error;
    }
  }
}
