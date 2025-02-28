import { Component, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { BtnCategoriaComponent } from '../../components/btn-categoria/btn-categoria.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { CategoriasInterface, SeccionInterface, categoriaData } from '../../data/categoriasData';
import { MatTabsModule} from '@angular/material/tabs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { CarruselComponent } from '../../components/carrusel/carrusel.component';

@Component({
  selector: 'app-categorias',
  imports: [MatTabsModule,MatIconModule, BtnCategoriaComponent, MatGridListModule, MatToolbarModule, MatDividerModule, CarruselComponent  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriasComponent {


  // Bloke que verifica si es Movile o pantalla escrotorio para presentar los botones de las categorias.
  isMobile: boolean;   
  constructor(public breakpointObserver: BreakpointObserver) {
    this.isMobile = window.innerWidth < 768; // Initial check on component load
  }
  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }



  // Bloke que presenta las categorias según la data.

  // Signasl de Categorias.
  categorias = signal(categoriaData); // Esta data podria pasar a ser dinamica si se implementa una coleccion de firestore y se hace un Get.

  // Método para leer los datos
  obtenerSecciones(ruta: string, signalSecciones: any) {
    const categoria = this.categorias().find(cat => cat.ruta === ruta);
    if (categoria) {
      if (Array.isArray(categoria.seccion)) {
        signalSecciones.set(categoria.seccion);
      } else {
        console.error(`El tipo de dato de categoria.${ruta}.seccion no es un array de SeccionInterface`);
      }
    } else {
      console.error(`La categoria ${ruta} no existe en los datos`);
    }
  }


}

