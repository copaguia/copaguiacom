import { Component, signal, ChangeDetectionStrategy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Angular Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

// Servicios y Componentes
import { AuthService } from '../../firebase/auth/auth.service';
import { categoriaData } from '../../data/categoriasData';
import { CarruselComponent } from '../../components/carrusel/carrusel.component';
import { ScrollBotonesComponent } from '../../components/scroll-botones/scroll-botones.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-categorias',
  standalone: true, // Convertido a standalone
  imports: [
    CommonModule, RouterLink,
    MatTabsModule, MatIconModule, MatGridListModule, MatToolbarModule,
    MatDividerModule, MatMenuModule, MatButtonModule,
    CarruselComponent, ScrollBotonesComponent
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriasComponent {

  // Inyección de servicios
  public authService = inject(AuthService);
  private router = inject(Router);

  // --- Propiedades existentes ---
  isMobile: boolean;
  categorias = signal(categoriaData);

  constructor(public breakpointObserver: BreakpointObserver) {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }
  
  // --- Nuevos métodos para el menú de usuario ---

  /**
   * Navega a la ruta especificada.
   * @param route La ruta a la que se desea navegar.
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    this.authService.desloguear();
  }
}
