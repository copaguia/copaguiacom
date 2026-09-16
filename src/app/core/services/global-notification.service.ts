import { Injectable, inject, signal } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, onSnapshot, query, orderBy, limit, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { NotificacionGlobal } from '../../interfaces/notificacion-global';
import { StorageService } from '../firebase/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalNotificationService {
  private firestore = inject(InstanciaFirebase).firestore;
  private storageService = inject(StorageService);
  
  public unreadNotifications = signal<NotificacionGlobal[]>([]);

  private readonly LOCAL_STORAGE_KEY = 'copaguia_vistas_notif_globales';
  private audioIntervalRef: any = null;

  constructor() {
    this.escucharNotificacionesGlobales();
  }

  public getIconoNotificacion(tipo: string): string {
    switch (tipo) {
      case 'promocion': return 'campaign';
      case 'oferta': return 'local_offer';
      case 'aviso': return 'info';
      case 'urgencia': return 'warning';
      default: return 'notifications_active';
    }
  }

  public getColorNotificacion(tipo: string): string {
    switch (tipo) {
      case 'promocion': return '#2196F3'; // Azul
      case 'oferta': return '#4CAF50';    // Verde
      case 'aviso': return '#FF9800';     // Naranja
      case 'urgencia': return '#F44336';  // Rojo
      default: return '#4CAF50';
    }
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
        tipo: datos.tipo as 'promocion' | 'aviso' | 'oferta' | 'urgencia',
        fechaCreacion: new Date().toISOString(),
        fechaCaducidad: datos.fechaCaducidad || new Date().toISOString(),
        vistasTotales: 0
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
      limit(10)
    );

    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        this.unreadNotifications.set([]);
        this.detenerAudio();
        return;
      }

      const ahora = new Date().toISOString();
      const vistas = this.getNotificacionesVistas();
      
      const notifs: NotificacionGlobal[] = [];
      let hayNueva = false;
      const currentUnreads = this.unreadNotifications();

      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data() as NotificacionGlobal;
        const notifId = docSnap.id;
        data.id = notifId;

        if (data.fechaCaducidad && data.fechaCaducidad < ahora) return;
        if (vistas.includes(notifId)) return;

        notifs.push(data);

        if (!currentUnreads.some(n => n.id === notifId)) {
          if (!hayNueva) {
            hayNueva = true;
            this.reproducirSonido(data.tipo);
          }
        }
      });

      this.unreadNotifications.set(notifs);

      if (notifs.length === 0) {
        this.detenerAudio();
      }
    }, (error) => {
      console.error('Error escuchando notificaciones globales:', error);
    });
  }

  public async marcarComoVista(id: string) {
    const vistas = this.getNotificacionesVistas();
    if (!vistas.includes(id)) {
      vistas.push(id);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(vistas));
      
      try {
        const docRef = doc(this.firestore, 'NotificacionesApp', id);
        await updateDoc(docRef, {
          vistasTotales: increment(1)
        });
      } catch (e) {
        console.error('Error al registrar la vista contable', e);
      }
    }
    const updated = this.unreadNotifications().filter(n => n.id !== id);
    this.unreadNotifications.set(updated);
    
    if (updated.length === 0) {
      this.detenerAudio();
    }
  }

  private getNotificacionesVistas(): string[] {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private reproducirSonido(tipo: string) {
    this.detenerAudio(); // Detener cualquier bucle previo

    const playAudio = () => {
      try {
        const audio = new Audio(`assets/sounds/${tipo}.mp3`);
        audio.play().catch(e => {
          console.warn('El navegador bloqueó la reproducción automática del sonido.', e);
        });
      } catch (e) {
        console.error('Error al reproducir audio', e);
      }
    };

    // Reproducir inmediatamente
    playAudio();

    // Luego repetir cada 30 segundos mientras no sea leída
    this.audioIntervalRef = setInterval(() => {
      playAudio();
    }, 30000); 
  }

  private detenerAudio() {
    if (this.audioIntervalRef) {
      clearInterval(this.audioIntervalRef);
      this.audioIntervalRef = null;
    }
  }
}
