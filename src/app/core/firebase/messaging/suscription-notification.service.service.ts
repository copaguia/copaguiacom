import { inject, Injectable, signal } from '@angular/core';
import { InstanciaFirebase } from '../instancias.service';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SuscriptionNotificationService {

  private firestore        = inject(InstanciaFirebase).firestore;
  private messaging        = inject(InstanciaFirebase).messaging;
  
  public contadorUnread    = signal<number>(0);
  public listaMensajes     = signal<any[]>([]);

  escucharNotificaciones(idUsuario: string): void {
    const uid              = idUsuario;
    const nombreColeccion  = 'Usuarios';
    const subColeccion     = 'notificaciones';
    const estadoFiltro     = 'UNREAD';

    const rutaNotificaciones = `${nombreColeccion}/${uid}/${subColeccion}`;
    const consulta           = query(
      collection(this.firestore, rutaNotificaciones), 
      where("estado", "==", estadoFiltro)
    );

    onSnapshot(consulta, (snapshot) => {
      const documentos     = snapshot.docs;
      const totalPendientes = documentos.length;
      const mapeoMensajes  = documentos.map(d => ({ id: d.id, ...d.data() }));
      
      this.contadorUnread.set(totalPendientes);
      this.listaMensajes.set(mapeoMensajes);
    });
  }

  async marcarComoLeidas(idUsuario: string): Promise<void> {
    const mensajesActuales = this.listaMensajes();
    const uid              = idUsuario;

    for (const msg of mensajesActuales) {
      const docRef         = doc(this.firestore, `Usuarios/${uid}/notificaciones`, msg.id);
      const nuevoEstado    = { estado: 'READ' };

      await updateDoc(docRef, nuevoEstado);
    }
  }
  
}
