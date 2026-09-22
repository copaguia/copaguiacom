import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
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

  public async obtenerNegociosPorSeccion(categoria: string, seccion?: string): Promise<NegocioInterface[]> {
    const filtros = seccion
      ? query(collection(this.firestore, 'negocios'), where('categoria', '==', categoria), where('seccion', '==', seccion))
      : query(collection(this.firestore, 'negocios'), where('categoria', '==', categoria));

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
    const snapshot = await getDocs(collection(this.firestore, 'negocios'));
    const todos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NegocioInterface));
    return todos.find(n =>
      (n.nombre && n.nombre.toLowerCase().includes(busqueda)) ||
      (n.descripcion && n.descripcion.toLowerCase().includes(busqueda))
    );
  }
}
