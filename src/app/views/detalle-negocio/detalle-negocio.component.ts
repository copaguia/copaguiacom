import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AnaliticaService } from '../../core/analitica/analitica.service.service';
import { NegocioInterface } from '../../interfaces/negocio-interface';

@Component({
  selector: 'app-detalle-negocio',
  imports: [CommonModule, MatTabsModule, MatIconModule, MatButtonModule, MatChipsModule ],
  templateUrl: './detalle-negocio.component.html',
  styleUrl: './detalle-negocio.component.css'
})
export class DetalleNegocioComponent {

  private analitica = inject(AnaliticaService);
  
  // Mock o Signal que viene de un servicio de búsqueda
  public negocio = signal<NegocioInterface | any>(null);

  ngOnInit() {
    const id = this.negocio().id;
    this.analitica.registrarEvento(id, 'visita');
  }
  
  

  public categoriasCatalogo = computed(() => {
    const items = this.negocio()?.catalogo || [];
    return [...new Set(items.map((i: any) => i.categoriaItem))];
  });

  public filtrarPorCat(categoria: string) {
    return this.negocio().catalogo.filter((i: any) => i.categoriaItem === categoria);
  }
}
