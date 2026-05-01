import { inject, Injectable, signal } from '@angular/core';
import { PedidoSubColeccion } from '../../interfaces/pedido-sub-coleccion';
import { collection, doc, orderBy, updateDoc, query, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { InstanciaFirebase } from './instancias.service';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

   private firestore = inject(InstanciaFirebase).firestore;
   public pedidos    = signal<PedidoSubColeccion[]>([]);
   private desuscribirse: Unsubscribe | undefined;

   public escucharPedidos(negocioId: string): void {
     const pedidosRef = collection(this.firestore, `negocios/${negocioId}/pedidos`);
     const q          = query(pedidosRef, orderBy('fecha', 'desc'));
     
     this.desuscribirse = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PedidoSubColeccion[];
        this.pedidos.set(data);
     });
   }

   public limpiarSuscripcion(): void {
    if (this.desuscribirse) {
      this.desuscribirse();
    }
   }

   public async actualizarEstadoPedido(negocioId: string, pedidoId: string, nuevoEstado: string): Promise<void> {
     const pedidoDoc = doc(this.firestore, `negocios/${negocioId}/pedidos/${pedidoId}`);
     await updateDoc(pedidoDoc, { estadoPedido: nuevoEstado });
   }

}
