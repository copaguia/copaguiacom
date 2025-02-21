import { Component, OnInit, signal } from '@angular/core';
import { BtnCategoriaComponent } from '../../components/btn-categoria/btn-categoria.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { CategoriasInterface, SeccionInterface, categoriaData } from '../../data/categoriasData';
import { MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-categorias',
  imports: [MatTabsModule, BtnCategoriaComponent, MatGridListModule, MatToolbarModule, MatDividerModule  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  categorias = signal(categoriaData); // Esta data podria pasar a ser dinamica si se implementa una coleccion de firestore y se hace un Get.

  obtenerSecciones(nombreCategoria: string, signalSecciones: any) {
    const categoria = this.categorias().find(cat => cat.nombreCategoria === nombreCategoria);
    if (categoria) {
      if (Array.isArray(categoria.seccion)) {
        signalSecciones.set(categoria.seccion);
      } else {
        console.error(`El tipo de dato de categoria.${nombreCategoria}.seccion no es un array de SeccionInterface`);
      }
    } else {
      console.error(`La categoria ${nombreCategoria} no existe en los datos`);
    }
  }
}
