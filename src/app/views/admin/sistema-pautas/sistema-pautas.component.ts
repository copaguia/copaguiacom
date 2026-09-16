import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { categoriaData } from '../../../data/categoriasData';

@Component({
  selector: 'app-sistema-pautas',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './sistema-pautas.component.html',
  styleUrl: './sistema-pautas.component.css'
})
export class SistemaPautasComponent {
  private router = inject(Router);

  totalCategorias = 0;
  totalSubSecciones = 0;

  constructor() {
    this.totalCategorias = categoriaData.length;
    this.totalSubSecciones = categoriaData.reduce((acc, curr) => acc + (curr.seccion?.length || 0), 0);
  }

  volver() {
    this.router.navigate(['/categorias']);
  }

  calcularTotalProyectado(): number {
    const carruselMes = this.totalCategorias * 5 * 50000 * 4;
    const ofertaMes = this.totalCategorias * 80000 * 4;
    const toolbarMes = this.totalSubSecciones * 30000 * 2;
    // Asumiendo 10 negocios por cada sub-sección como proyección base
    const suscripcionesMes = this.totalSubSecciones * 10 * 35000;
    
    return carruselMes + ofertaMes + toolbarMes + suscripcionesMes;
  }
}
