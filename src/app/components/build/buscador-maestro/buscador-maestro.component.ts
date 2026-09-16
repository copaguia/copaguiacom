import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { collection, getDocs, query, DocumentData } from 'firebase/firestore';
import { InstanciaFirebase } from '../../../core/firebase/instancias.service';

// Importación actualizada a la fuente de datos unificada
import { categoriaData } from '../../../data/categoriasData';
import { NegocioInterface } from '../../../interfaces/negocio-interface';

@Component({
  selector: 'app-buscador-maestro',
  standalone: true, // Se aÃ±ade standalone: true
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, RouterLink],
  templateUrl: './buscador-maestro.component.html',
  styleUrl: './buscador-maestro.component.css'
})
export class BuscadorMaestroComponent {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private firestore = inject(InstanciaFirebase).firestore;
  private worker?:      Worker;
  
  // Se asigna la nueva fuente de datos
  public categorias   = categoriaData;
  public negociosFull = signal<NegocioInterface[]>([]); // Se carga desde el servicio
  public resultados   = signal<NegocioInterface[]>([]);
  
  public formGroup = this.formBuilder.group({
    termino:   [''],
    categoria: ['']
  });

  constructor() {
    this.inicializarWorker();
    this.cargarTodosLosNegocios();
    
    // Efecto reactivo: cuando el formulario cambie, enviamos al Worker
    this.formGroup.valueChanges.subscribe(val => {
      this.ejecutarBusqueda(val.termino || '', val.categoria || '');
    });

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.formGroup.patchValue({ termino: params['q'] });
      }
    });
  }

  private async cargarTodosLosNegocios() {
    try {
      const q = query(collection(this.firestore, 'negocios'));
      const snapshot = await getDocs(q);
      const negocios = snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return { id: doc.id, ...data } as NegocioInterface;
      });
      this.negociosFull.set(negocios);
      // Disparar búsqueda inicial si hay término
      this.ejecutarBusqueda(this.formGroup.value.termino || '', this.formGroup.value.categoria || '');
    } catch (e) {
      console.error('Error cargando negocios globales', e);
    }
  }

  private inicializarWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../../core/benchmark/browser/buscador.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        this.resultados.set(data);
      };
    }
  }

  private ejecutarBusqueda(termino: string, categoria: string) {
    if (this.worker) {
      this.worker.postMessage({
        lista:     this.negociosFull(),
        termino:   termino,
        categoria: categoria
      });
    } else {
      // Fallback si el navegador no soporta workers
      const data = this.negociosFull().filter(n => n.nombre.includes(termino));
      this.resultados.set(data);
    }
  }

}
