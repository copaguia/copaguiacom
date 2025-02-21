import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CategoriasInterface, SeccionInterface } from '../../data/categoriasData';



@Component({
  selector: 'app-btn-categoria',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './btn-categoria.component.html',
  styleUrl: './btn-categoria.component.css'
})
export class BtnCategoriaComponent {


  @Input() conector!: CategoriasInterface | SeccionInterface; // LAS INTERFACE VIENEN DE NUESTRA DATA ESTÁTICA OJO. 

  // IMPORTANTE: PODREMOS USAR 2 O MAS TIPOS DE INTERFACE SEGÚN SEA EL CASO PARA ESTE COMPONENTE REUSABLE
  // SOLO DEBEMOS IMPORTARLA EN EL CASO DE USO QUE QUEREMOS.

}
