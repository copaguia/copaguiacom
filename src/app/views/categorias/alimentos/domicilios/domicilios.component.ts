import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ToolBarPageComponent } from '../../../../components/build/tool-bar-page/tool-bar-page.component';
import { CommonModule } from '@angular/common';
import { collection, onSnapshot, query, Unsubscribe, where } from 'firebase/firestore';
import { NegocioInterface } from '../../../../interfaces/negocio-interface';
import { InstanciaFirebase } from '../../../../core/firebase/instancias.service';


/**
 * Componente para mostrar los negocios de domicilios en Copacabana
 * Implementa OnInit para inicializar datos y OnDestroy para limpiar suscripciones
 */
@Component({
  selector: 'app-domicilios',
  standalone: true, // Marca el componente como standalone para la nueva arquitectura de Angular
  imports: [ToolBarPageComponent, CommonModule], // Importa los componentes y módulos necesarios
  templateUrl: './domicilios.component.html',
  styleUrl: './domicilios.component.css'
})
export class DomiciliosComponent implements OnInit, OnDestroy {

  private firestore= inject(InstanciaFirebase).firestore;
  
  // Datos y estado del componente utilizando signals para reactividad
  public title = 'Domicilios en Copacabana'; // Título que se mostrará en la página
  public negocios = signal<NegocioInterface[]>([]); // Signal para los negocios (estado reactivo)
  public isLoading = signal<boolean>(true); // Control de estado de carga
  public error = signal<string | null>(null); // Control de errores para mostrar al usuario

  // Variable para controlar la suscripción a Firestore y poder cancelarla
  private desuscribirse: Unsubscribe | undefined;

  
  ngOnInit() {
    const seccion = 'Domicilios';
    this.isLoading.set(true); // Indica que se están cargando los datos
    this.desuscribirse = this.obtenerNegocios(seccion, this.negocios);
  }

  
  ngOnDestroy() {
    this.limpiarSuscripcion();
  }

  
  private obtenerNegocios(seccion: string, negociosSignal: WritableSignal<NegocioInterface[]>): Unsubscribe {
    // Configura la referencia a la colección y la consulta con filtro
    const collectionRef = collection(this.firestore, 'Negocios');
    const q = query(collectionRef, where('seccion', '==', seccion));

    // Establece un listener para cambios en tiempo real con manejo de éxito y error
    return onSnapshot(
      q,
      (querySnapshot) => {
        // Procesa los documentos recibidos
        const negociosData: NegocioInterface[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as NegocioInterface;
          negociosData.push(data);
        });
        // Actualiza el estado con los datos obtenidos
        negociosSignal.set(negociosData);
        this.isLoading.set(false); // Indica que la carga ha terminado
        this.error.set(null); // Limpia cualquier error previo
      },
      (error) => {
        // Manejo de errores durante la consulta
        console.error('Error al obtener los negocios:', error);
        this.error.set('Error al cargar los datos. Por favor, intente más tarde.');
        this.isLoading.set(false); // Detiene el indicador de carga incluso si hay error
      }
    );
  }

  /**
   * Cancela la suscripción a los cambios en tiempo real de Firestore
   * Importante para evitar fugas de memoria cuando el componente se destruye
   */
  private limpiarSuscripcion() {
    if (this.desuscribirse) {
      this.desuscribirse();
      this.desuscribirse = undefined;
    }
  }
}