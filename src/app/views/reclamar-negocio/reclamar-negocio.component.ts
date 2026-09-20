import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminBorradorService } from '../../core/services/admin-borrador.service';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

declare var WidgetCheckout: any;

interface PlanWompi {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  beneficios: string[];
}

@Component({
  selector: 'app-reclamar-negocio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CurrencyPipe
  ],
  templateUrl: './reclamar-negocio.component.html',
  styleUrls: ['./reclamar-negocio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReclamarNegocioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private borradorService = inject(AdminBorradorService);
  public authService = inject(AuthService);

  public negocio = signal<any | null>(null);
  public estaCargando = signal<boolean>(true);
  public error = signal<string>('');

  // Definir los planes basados en los precios del sistema
  public planes: PlanWompi[] = [
    {
      id: 'basico',
      nombre: 'Plan Básico',
      precio: 35000,
      descripcion: 'Perfecto para empezar a tener visibilidad online.',
      beneficios: ['Listado en la categoría principal', 'Datos de contacto visibles', 'Soporte estándar']
    },
    {
      id: 'destacado',
      nombre: 'Plan Destacado',
      precio: 65000,
      descripcion: 'Ideal para destacar sobre la competencia.',
      beneficios: ['Aparece primero en búsquedas', 'Galería de hasta 5 imágenes', 'Botón directo a WhatsApp', 'Soporte prioritario']
    },
    {
      id: 'vip',
      nombre: 'Plan VIP (Anual)',
      precio: 135000,
      descripcion: 'La mejor oferta para maximizar tus ventas todo el año.',
      beneficios: ['Ahorras más del 40%', 'Posicionamiento Premium', 'Promociones ilimitadas', 'Insignia de Negocio Verificado']
    }
  ];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Enlace inválido o incompleto.');
      this.estaCargando.set(false);
      return;
    }

    try {
      const data = await this.borradorService.obtenerBorrador(id);
      if (!data) {
        this.error.set('No se encontró el negocio. Es posible que el enlace haya expirado.');
      } else if (data.verificado) {
        this.error.set('Este negocio ya ha sido verificado y reclamado.');
      } else {
        this.negocio.set(data);
      }
    } catch (err) {
      console.error(err);
      this.error.set('Ocurrió un error al cargar los datos del negocio.');
    } finally {
      this.estaCargando.set(false);
    }
  }

  async ingresarConGoogle() {
    try {
      await this.authService.loginConGoogle();
    } catch (err) {
      this.error.set('Error al iniciar sesión.');
    }
  }

  pagarConWompi(plan: PlanWompi) {
    const negocioActual = this.negocio();
    const perfilActual = this.authService.perfilLectura();
    
    if (!negocioActual || !perfilActual) return;

    // Crear referencia única: negocioId_uidUsuario_planId
    const reference = `${negocioActual.id}_${perfilActual.id}_${plan.id}`;
    const amountInCents = plan.precio * 100;

    const checkout = new WidgetCheckout({
      currency: 'COP',
      amountInCents: amountInCents,
      reference: reference,
      publicKey: environment.wompiPublicKey,
      redirectUrl: window.location.origin + '/categorias', // Redirigir al inicio después de pagar
    });

    checkout.open((result: any) => {
      const transaction = result.transaction;
      if (transaction.status === 'APPROVED') {
        alert('¡Pago exitoso! Tu negocio se activará automáticamente en unos segundos.');
        this.router.navigate(['/categorias']);
      } else {
        alert('El pago no fue aprobado o fue cancelado. Estado: ' + transaction.status);
      }
    });
  }
}
