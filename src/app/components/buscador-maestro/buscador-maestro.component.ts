import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CATEGORIAS_NEGOCIOS } from '../../data/categorias-negocios';
import { NegocioInterface } from '../../interfaces/negocio-interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buscador-maestro',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, RouterLink],
  templateUrl: './buscador-maestro.component.html',
  styleUrl: './buscador-maestro.component.css'
})
export class BuscadorMaestroComponent {

  private formBuilder = inject(FormBuilder);
  private worker?:      Worker;
  
  public categorias   = CATEGORIAS_NEGOCIOS;
  public negociosFull = signal<NegocioInterface[]>([]); // Se carga desde el servicio
  public resultados   = signal<NegocioInterface[]>([]);
  
  public formGroup = this.formBuilder.group({
    termino:   [''],
    categoria: ['']
  });

  constructor() {
    this.inicializarWorker();
    
    // Efecto reactivo: cuando el formulario cambie, enviamos al Worker
    this.formGroup.valueChanges.subscribe(val => {
      this.ejecutarBusqueda(val.termino || '', val.categoria || '');
    });
  }

  private inicializarWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./buscador.worker', import.meta.url));
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
      // Fallback si el navegador no soporta workers (raro en 2026)
      const data = this.negociosFull().filter(n => n.nombre.includes(termino));
      this.resultados.set(data);
    }
  }

}
