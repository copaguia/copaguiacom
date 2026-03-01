import { Component, OnInit, signal } from '@angular/core';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';

@Component({
  selector: 'app-admin-verificacion',
  imports: [],
  templateUrl: './admin-verificacion.component.html',
  styleUrl: './admin-verificacion.component.css'
})
export class AdminVerificacionComponent implements OnInit {

  private firestore = getFirestore();
  
  public negociosPendientes = signal<any[]>([]);
  public columnas           = ['negocio', 'contacto', 'acciones'];

  async ngOnInit() {
    await this.cargarPendientes();
  }

  private async cargarPendientes() {
    const q = query(collection(this.firestore, 'negocios'), where('verificado', '==', false));
    const querySnapshot = await getDocs(q);
    const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.negociosPendientes.set(lista);
  }

  public async verificar(id: string) {
    const negocioRef = doc(this.firestore, `negocios/${id}`);
    
    // El negocio ahora aparecerá con el check azul en toda la app
    await updateDoc(negocioRef, { verificado: true });
    
    // Refrescar lista local (Reactive Flow)
    this.negociosPendientes.update(lista => lista.filter(n => n.id !== id));
  }

}
