import { Injectable, inject, signal } from '@angular/core';
import { InstanciaFirebase } from '../firebase/instancias.service';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { NotificacionGlobal } from '../../interfaces/notificacion-global';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private firestore = inject(InstanciaFirebase).firestore;

  public totalUsuarios = signal<number | null>(null);
  public totalNegocios = signal<number | null>(null);
  public negociosActivos = signal<number | null>(null);
  public vistasNotificaciones = signal<number | null>(null);
  
  public loading = signal<boolean>(false);

  constructor() { }

  async cargarEstadisticas() {
    this.loading.set(true);
    try {
      // 1. Total Usuarios
      const usuariosColl = collection(this.firestore, 'Usuarios');
      const countUsuarios = await getCountFromServer(usuariosColl);
      this.totalUsuarios.set(countUsuarios.data().count);

      // 2. Total Negocios y Negocios Activos
      const negociosColl = collection(this.firestore, 'negocios');
      const negociosSnapshot = await getDocs(negociosColl);
      this.totalNegocios.set(negociosSnapshot.size);

      // Calcular activos
      const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
      const hoy = new Date();
      const diaActual = dias[hoy.getDay()];
      const horaActual = hoy.toTimeString().substring(0, 5); // "HH:MM"

      let activos = 0;
      negociosSnapshot.forEach(doc => {
        const negocio = doc.data() as NegocioInterface;
        if (negocio.horarios) {
          const horarioHoy = (negocio.horarios as any)[diaActual];
          if (horarioHoy && horarioHoy.abierto) {
            if (horaActual >= horarioHoy.apertura && horaActual <= horarioHoy.cierre) {
              activos++;
            }
          }
        }
      });
      this.negociosActivos.set(activos);

      // 3. Vistas de Notificaciones
      const notifColl = collection(this.firestore, 'NotificacionesApp');
      const notifSnapshot = await getDocs(notifColl);
      let totalVistas = 0;
      notifSnapshot.forEach(doc => {
        const data = doc.data() as NotificacionGlobal;
        if (data.vistasTotales) {
          totalVistas += data.vistasTotales;
        }
      });
      this.vistasNotificaciones.set(totalVistas);

    } catch (e) {
      console.error('Error cargando estadísticas', e);
    } finally {
      this.loading.set(false);
    }
  }
}
