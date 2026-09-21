import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { MarketplaceItem } from '../../core/models/marketplace.model';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketplaceComponent implements OnInit {
  router = inject(Router);
  marketplaceService = inject(MarketplaceService);
  
  items = signal<MarketplaceItem[]>([]);
  cargando = signal(true);

  async ngOnInit() {
    try {
      const data = await this.marketplaceService.obtenerItems();
      this.items.set(data);
    } catch (e) {
      console.error(e);
    } finally {
      this.cargando.set(false);
    }
  }

  volver() {
    this.router.navigate(['/categorias']);
  }
}
