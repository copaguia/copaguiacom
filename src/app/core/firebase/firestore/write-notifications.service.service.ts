import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../instancias.service';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class WriteNotificationsServiceService {

  private firestore = inject(InstanciaFirebase).firestore;

  async programarEnvioMasivo(datos: any): Promise<void> {
    const coleccionReferencia = collection(this.firestore, 'notificaciones_programadas');
    
    const tituloMensaje       = datos.titulo;
    const cuerpoMensaje       = datos.cuerpo;
    const fechaProgramada     = Timestamp.fromDate(datos.fecha);
    const topicoDestino       = datos.topico || 'general';
    const estadoInicial       = 'PENDIENTE';

    const documentoNotificacion = {
      titulo         : tituloMensaje,
      cuerpo         : cuerpoMensaje,
      fechaEnvio     : fechaProgramada,
      topico         : topicoDestino,
      estado         : estadoInicial,
      fechaCreacion  : Timestamp.now()
    };

    try {
      await addDoc(coleccionReferencia, documentoNotificacion);
    } catch (error) {
      const mensajeError      = "Error al escribir la notificación en Firestore";
      console.error(mensajeError, error);
      throw error;
    }
  }
  
}
