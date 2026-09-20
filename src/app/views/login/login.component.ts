// Angular Core
import { Component, inject, computed, effect, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Componentes de la aplicación
import { BtnLoginGoogleComponent } from '../../components/extension/btnLoginGoogle/btnLoginGoogle.component';

// Servicios y modelos de la aplicación
import { AuthService } from '../../core/auth/auth.service';
import { StateEnum } from '../../enums/state.enum';
import { TenantService } from '../../core/services/tenant.service';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BtnLoginGoogleComponent,
    MatDivider
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  public authService = inject(AuthService);
  public tenantService = inject(TenantService);

  // Computadas para Branding Dinámico
  public logo = computed(() => {
    const tenant = this.tenantService.currentTenant();
    return tenant?.logoUrl || 'assets/brand/dp-logo.png';
  });

  public mensaje = computed(() => {
    const tenant = this.tenantService.currentTenant();
    return tenant ? `Bienvenido a ${tenant.nombre}` : 'Bienvenido a Directorio Paisa';
  });

  public descripcion = computed(() => {
    const tenant = this.tenantService.currentTenant();
    return tenant?.descripcion || 'La guía comercial más completa de tu ciudad.';
  });

  public rutaRedireccion = signal<string>('/categorias');

  // Estado del widget de contexto
  public fechaActual = signal<string>('');
  public horaActual = signal<string>('');
  public ubicacionLocal = signal<string>('Detectando ubicación...');

  // Signal que indica si el servicio de autenticación todavía está en su fase inicial de carga.
  isAuthLoading = computed(() => !this.authService.authLista());

  constructor() {
    effect(() => {
      // Redirige solo cuando el servicio de autenticación ha finalizado con éxito
      if (this.authService.estado() === StateEnum.EXITO) {
        this.router.navigate([this.rutaRedireccion()]);
      }
    });

    // Reloj en tiempo real
    setInterval(() => {
      const now = new Date();
      this.horaActual.set(now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
  }

  ngOnInit() {
    const now = new Date();
    this.fechaActual.set(now.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    // Obtener ubicación mediante IP-API (sin permisos bloqueantes del navegador)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_name) {
          this.ubicacionLocal.set(`${data.city}, ${data.country_name}`);
        } else {
          this.ubicacionLocal.set('Ubicación desconocida');
        }
      })
      .catch(() => this.ubicacionLocal.set('Ubicación no disponible'));
  }
}

