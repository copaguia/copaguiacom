import { inject, Injectable } from '@angular/core';
import { InstanciaFirebase } from '../instancias.service';
import { collection, doc, getDocs, Timestamp, writeBatch } from 'firebase/firestore';
import { PromocionesInterface } from '../../../interfaces/promociones-interface';
import { StateEnum } from '../../../enums/state.enum';

@Injectable({
  providedIn: 'root'
})
export class DistPromotionsService {

  private firestore = inject(InstanciaFirebase).firestore;

  async distribuirPromocionMasiva(datos: PromocionesInterface): Promise<void> {
    try {
      const usuariosRef       = collection(this.firestore, 'Usuarios');
      const snapshot          = await getDocs(usuariosRef);
      
      console.log(`Usuarios detectados: ${snapshot.size}`); // <--- LOG DE CONTROL
  
      if (snapshot.empty) {
        console.warn("No hay usuarios en la colección para distribuir.");
        return;
      }
  
      const loteEscritura     = writeBatch(this.firestore);
  
      snapshot.forEach(usuarioDoc => {
        const uid             = usuarioDoc.id;
        const rutaNotif       = collection(this.firestore, `Usuarios/${uid}/notificaciones`);
        const nuevoDocRef     = doc(rutaNotif);
  
        loteEscritura.set(nuevoDocRef, { ...datos, fecha: Timestamp.now() });
      });
  
      await loteEscritura.commit();
      console.log("¡Batch ejecutado correctamente!");
  
    } catch (error) {
      console.error("Error en Firestore:", error); // <--- REVISA ESTO EN LA CONSOLA
      throw error;
    }
  }
  
}
