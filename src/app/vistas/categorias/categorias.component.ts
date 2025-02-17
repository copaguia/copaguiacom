import { Component, signal } from '@angular/core';
import { BtnCategoriaComponent } from '../../components/btn-categoria/btn-categoria.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { categoriaData } from '../../staticData/categoriasData';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-categorias',
  imports: [MatTabsModule, BtnCategoriaComponent, MatGridListModule, MatToolbarModule, MatDividerModule  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {


  public categorias = signal(categoriaData);  
    
}
