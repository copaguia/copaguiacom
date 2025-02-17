import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CategoriaInterface } from '../../interfaces/categoria-interface';



@Component({
  selector: 'app-btn-categoria',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './btn-categoria.component.html',
  styleUrl: './btn-categoria.component.css'
})
export class BtnCategoriaComponent {

  @Input() conector!: CategoriaInterface;

}
