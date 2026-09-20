import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-spinner diameter="40"></mat-spinner>
      <h2>Completando inicio de sesión...</h2>
      <p>{{ mensaje() }}</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      gap: 16px;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  public mensaje = signal('Validando token...');

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const token = params['token'];
      if (!token) {
        this.mensaje.set('Error: Token no proporcionado');
        setTimeout(() => this.router.navigate(['/login']), 2000);
        return;
      }

      try {
        await this.authService.loginConToken(token);
        this.mensaje.set('¡Autenticación exitosa! Entrando...');
        // Redirigir al inicio/categorías
        this.router.navigate(['/categorias']);
      } catch (error: any) {
        console.error(error);
        this.mensaje.set('Error iniciando sesión: ' + error.message);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    });
  }
}
