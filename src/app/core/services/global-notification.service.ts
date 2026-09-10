import { Injectable, inject, signal } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, onSnapshot, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { NotificacionGlobal } from '../../interfaces/notificacion-global';
import { StorageService } from '../firebase/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalNotificationService {
  private firestore = inject(InstanciaFirebase).firestore;
  private storageService = inject(StorageService);
  
  public hasNewNotification = signal<boolean>(false);
  public currentNotification = signal<NotificacionGlobal | null>(null);

  private readonly LOCAL_STORAGE_KEY = 'copaguia_vistas_notif_globales';

  constructor() {
    this.escucharNotificacionesGlobales();
  }

  /**
   * Sube la imagen y crea la notificación en Firestore.
   */
  async crearNotificacionGlobal(datos: Partial<NotificacionGlobal>, archivoImagen?: File): Promise<void> {
    try {
      let imagenUrl = '';
      if (archivoImagen) {
        const path = `notificaciones_app/${Date.now()}_${archivoImagen.name}`;
        imagenUrl = await this.storageService.uploadFile(path, archivoImagen);
      }

      const nuevaNotificacion: NotificacionGlobal = {
        titulo: datos.titulo || '',
        mensaje: datos.mensaje || '',
        fechaCreacion: new Date().toISOString(),
        fechaCaducidad: datos.fechaCaducidad || new Date().toISOString(),
      };

      if (imagenUrl) {
        nuevaNotificacion.imagenUrl = imagenUrl;
      }

      const coleccionRef = collection(this.firestore, 'NotificacionesApp');
      await addDoc(coleccionRef, nuevaNotificacion);
      console.log('Notificación global creada correctamente');
    } catch (error) {
      console.error('Error al crear notificación global:', error);
      throw error;
    }
  }

  private escucharNotificacionesGlobales() {
    const q = query(
      collection(this.firestore, 'NotificacionesApp'),
      orderBy('fechaCreacion', 'desc'),
      limit(1)
    );

    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        this.hasNewNotification.set(false);
        this.currentNotification.set(null);
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data() as NotificacionGlobal;
      const notifId = doc.id;
      data.id = notifId;

      // Verificar caducidad
      const ahora = new Date().toISOString();
      if (data.fechaCaducidad && data.fechaCaducidad < ahora) {
        // Caducada
        this.hasNewNotification.set(false);
        this.currentNotification.set(null);
        return;
      }

      // Verificar si ya fue vista
      const vistas = this.getNotificacionesVistas();
      if (vistas.includes(notifId)) {
        this.hasNewNotification.set(false);
        this.currentNotification.set(data); // La guardamos por si quiere verla de nuevo
      } else {
        // ES NUEVA!
        this.currentNotification.set(data);
        
        // Si no estaba ya activa, reproducimos el sonido
        if (!this.hasNewNotification()) {
          this.hasNewNotification.set(true);
          this.reproducirSonido();
        }
      }
    }, (error) => {
      console.error('Error escuchando notificaciones globales:', error);
    });
  }

  public marcarComoVista(id: string) {
    const vistas = this.getNotificacionesVistas();
    if (!vistas.includes(id)) {
      vistas.push(id);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(vistas));
    }
    this.hasNewNotification.set(false);
  }

  private getNotificacionesVistas(): string[] {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private reproducirSonido() {
    try {
      // Usamos un sonido por defecto o uno provisto en assets
      const audio = new Audio('assets/sounds/bell.mp3');
      audio.play().catch(e => {
        console.warn('El navegador bloqueó la reproducción automática del sonido. El usuario debe interactuar con la página primero.', e);
      });
      
      // Simular "tilin tilin tilin" (3 veces)
      let count = 1;
      const interval = setInterval(() => {
        if (count >= 3) {
          clearInterval(interval);
        } else {
          const nextAudio = new Audio('assets/sounds/bell.mp3');
          nextAudio.play().catch(() => {});
          count++;
        }
      }, 1000); // 1 segundo entre cada tilin
    } catch (e) {
      console.error('Error al reproducir audio', e);
    }
  }
}
