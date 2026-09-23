import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, doc, getDocs, query, updateDoc, where, QueryConstraint } from 'firebase/firestore';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {
  private firestore = inject(InstanciaFirebase).firestore;
  private tenantService = inject(TenantService);

  public async actualizarNegocio(id: string, data: Partial<NegocioInterface>): Promise<void> {
    const negocioRef = doc(this.firestore, `negocios/${id}`);
    await updateDoc(negocioRef, data);
  }

  public async obtenerNegociosPorSeccion(categoria: string, seccion?: string): Promise<NegocioInterface[]> {
    const tenant = this.tenantService.currentTenant();
    
    const constraints: QueryConstraint[] = [where('categoria', '==', categoria)];
    if (seccion) constraints.push(where('seccion', '==', seccion));
    
    // Filtro crucial: Solo traer negocios que pertenecen al directorio actual
    if (tenant && tenant !== 'default') {
      constraints.push(where('zonaAsignada', '==', tenant));
    }

    const filtros = query(collection(this.firestore, 'negocios'), ...constraints);

    const snapshot = await getDocs(filtros);
    return snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as NegocioInterface))
      .sort((a, b) => {
        if (a.plan === 'plus Premium' && b.plan !== 'plus Premium') return -1;
        if (a.plan !== 'plus Premium' && b.plan === 'plus Premium') return 1;
        return 0;
      });
  }

  public async buscarNegocioPorTermino(termino: string): Promise<NegocioInterface | undefined> {
    const busqueda = termino.trim().toLowerCase();
    if (!busqueda) return undefined;
    
    const tenant = this.tenantService.currentTenant();
    const constraints: QueryConstraint[] = [];
    if (tenant && tenant !== 'default') {
      constraints.push(where('zonaAsignada', '==', tenant));
    }
    
    const snapshot = await getDocs(query(collection(this.firestore, 'negocios'), ...constraints));
    const todos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NegocioInterface));
    return todos.find(n =>
      (n.nombre && n.nombre.toLowerCase().includes(busqueda)) ||
      (n.descripcion && n.descripcion.toLowerCase().includes(busqueda))
    );
  }
}
