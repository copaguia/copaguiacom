import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/auth/auth.service';
import { categoriaData } from '../../data/categoriasData';
import { CarruselComponent } from '../../components/build/carrusel/carrusel.component';
import { ScrollBotonesComponent } from '../../components/build/scroll-botones/scroll-botones.component';
import { AuthorizationService } from '../../core/auth/authorization.service';
import { NegocioVerificationService } from '../../core/auth/negocio-verification.service';
import { BtnNotificationsComponent } from '../../components/build/btn-notifications/btn-notifications.component';
import { GlobalNotificationService } from '../../core/services/global-notification.service';
import { GlobalNotificationDialogComponent } from '../../components/build/global-notification-dialog/global-notification-dialog.component';
import { CrearNotificacionDialogComponent } from '../../components/build/crear-notificacion-dialog/crear-notificacion-dialog.component';
import { PublicidadService } from '../../core/services/publicidad.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, MatGridListModule, MatToolbarModule, MatDividerModule, MatMenuModule, MatButtonModule, MatDialogModule, CarruselComponent, ScrollBotonesComponent, BtnNotificationsComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriasComponent {
  authorization = inject(AuthorizationService);
  authService = inject(AuthService);
  negocioService = inject(NegocioVerificationService);
  globalNotifService = inject(GlobalNotificationService);
  publicidadService = inject(PublicidadService);
  dialog = inject(MatDialog);
  router = inject(Router);

  categorias = signal(categoriaData);
  tituloToolbar = signal(categoriaData[0]?.ruta || 'CATEGORIAS');
  diccionarioBanners = signal<Record<string, any>>({});

  constructor() {
    this.cargarBannersParaCategoriaActiva(this.tituloToolbar());
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tituloToolbar.set(event.tab.textLabel);
    this.cargarBannersParaCategoriaActiva(event.tab.textLabel);
  }

  async cargarBannersParaCategoriaActiva(categoriaId: string) {
    if (this.diccionarioBanners()[categoriaId]) return;
    const banners = await this.publicidadService.obtenerBanners(categoriaId);
    this.diccionarioBanners.update(d => ({...d, [categoriaId]: banners}));
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
    this.router.navigate(['admin/perfil-negocio-editor']);
  }

  navigateToCreateBusiness(): void {
    this.router.navigate(['admin/agregar-negocio']);
  }

  openGlobalNotification() {
    const data = this.globalNotifService.currentNotification();
    if (data) {
      this.dialog.open(GlobalNotificationDialogComponent, {
        data: data,
        width: '90%',
        maxWidth: '400px',
        panelClass: 'dark-dialog'
      });
    }
  }

  openCrearNotificacion() {
    this.dialog.open(CrearNotificacionDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      panelClass: 'custom-dialog-container'
    });
  }

  navigateToEstadisticas() {
    this.router.navigate(['/admin/estadisticas']);
  }

  logout(): void {
    this.authService.desloguear();
  }
}
