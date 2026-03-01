import { Component, signal, ChangeDetectionStrategy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

// Servicios y Componentes
import { AuthService } from '../../core/auth/auth.service';
import { categoriaData } from '../../data/categoriasData';
import { CarruselComponent } from '../../components/build/carrusel/carrusel.component';
import { ScrollBotonesComponent } from '../../components/build/scroll-botones/scroll-botones.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthorizationService } from '../../core/auth/authorization.service';
import { NegocioVerificationService } from '../../core/auth/negocio-verification.service'; // <-- NUEVO SERVICIO

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

  public authorization = inject(AuthorizationService);
  public authService = inject(AuthService);
  public negocioService = inject(NegocioVerificationService); // <-- INYECTAMOS EL SERVICIO
  private router = inject(Router);

  isMobile: boolean;
  categorias = signal(categoriaData);
  tituloToolbar = signal(categoriaData[0]?.ruta || 'CATEGORIAS'); 

  constructor(public breakpointObserver: BreakpointObserver) {
    this.isMobile = window.innerWidth < 768;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tituloToolbar.set(event.tab.textLabel);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToProfile(): void {
    const perfil = this.authService.perfilLectura();
    if (perfil && perfil.nombreUsuario) {
      this.router.navigate(['/perfil', perfil.nombreUsuario]);
    } else {
      console.error('No se puede navegar al perfil: Perfil o nombre de usuario no disponible.');
      this.router.navigate(['/login']);
    }
  }

  navigateToEditBusiness(): void {
    this.router.navigate(['/perfil-negocio-editor']);
  }

  navigateToCreateBusiness(): void {
    this.router.navigate(['/onboarding-negocio-registro']);
  }

  logout(): void {
    this.authService.desloguear();
  }
}
