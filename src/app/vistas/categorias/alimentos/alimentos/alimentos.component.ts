import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SeccionInterface } from '../../../../data/categoriasData';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-alimentos',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './alimentos.component.html',
  styleUrl: './alimentos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlimentosComponent {
  secciones = signal<SeccionInterface[]>([
    { seccion: 'Domicilios', icono:'icono' },
    { seccion: 'Comida Rápida', icono:'icono' },
    { seccion: 'Cafe y Parva', icono:'icono' },
    { seccion: 'Helados & Postres', icono:'icono' },
    { seccion: 'Restaurantes y Pizzas', icono:'icono' },
    { seccion: 'Supermercados', icono:'icono' },
    { seccion: 'Plaza de Mercado', icono:'icono' },
    { seccion: 'Carnes y Legumbres', icono:'icono' },
  ])
}
