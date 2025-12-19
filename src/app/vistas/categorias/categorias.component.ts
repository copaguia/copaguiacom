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
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, MatIconModule, MatGridListModule, MatToolbarModule,
    MatDividerModule, MatMenuModule, MatButtonModule,
    CarruselComponent, ScrollBotonesComponent
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriasComponent {

  public authService = inject(AuthService);
  private router = inject(Router);

  isMobile: boolean;
  categorias = signal(categoriaData);

  constructor(public breakpointObserver: BreakpointObserver) {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }

  /**
   * Navega a una ruta estática especificada (p. ej. '/configuracion').
   * @param route La ruta a la que se desea navegar.
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Navega a la página de perfil del usuario actual.
   * Utiliza el 'nombreUsuario' del perfil para construir la URL dinámica.
   */
  navigateToProfile(): void {
    const perfil = this.authService.perfilLectura();
    if (perfil && perfil.nombreUsuario) {
      this.router.navigate(['/perfil', perfil.nombreUsuario]);
    } else {
      console.error('No se puede navegar al perfil: Perfil o nombre de usuario no disponible.');
      // Como fallback, redirigimos al login para evitar un estado inconsistente.
      this.router.navigate(['/login']);
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    this.authService.desloguear();
  }
}
