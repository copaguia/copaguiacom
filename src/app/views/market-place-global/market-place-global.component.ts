import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service.service';
import { ProductoMarketplace } from '../../interfaces/producto-marketplace';

@Component({
  selector: 'app-market-place-global',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './market-place-global.component.html',
  styleUrl: './market-place-global.component.css'
})
export class MarketPlaceGlobalComponent {

  private pedidoService = inject(PedidoService);
  
  // Este Signal se alimentaría de un Web Worker que una los catálogos de todos los negocios
  public todosLosProductos = signal<ProductoMarketplace[]>([]);

  public comprarDirecto(producto: ProductoMarketplace) {
    // Al hacer clic en comprar, lo agregamos al carrito y abrimos el catálogo del negocio 
    // para que el usuario pueda finalizar el pedido por WhatsApp.
    this.pedidoService.agregarAlCarrito(producto, 1);
    // Redirigir al flujo de compra del negocio específico
  }

}
