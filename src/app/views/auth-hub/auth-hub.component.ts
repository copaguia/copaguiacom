import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { httpsCallable } from 'firebase/functions';
import { InstanciaFirebase } from '../../core/firebase/instancias.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { collection, getDocs, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-auth-hub',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule],
  template: `
    <div class="hub-container">
      <img [src]="tenantLogo()" alt="Logo" class="tenant-logo">
      <h1>Iniciar sesión en {{ tenantNombre() }}</h1>
      <p>Acceso seguro centralizado.</p>
      
      @if (cargando()) {
        <mat-spinner diameter="40"></mat-spinner>
        <p>{{ mensaje() }}</p>
      } @else {
        <button mat-flat-button color="primary" class="btn-sso" (click)="iniciarSSO()">
          Continuar con Google
        </button>
      }
    </div>
  `,
  styles: [`
    .hub-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      gap: 16px;
      background-color: #fafafa;
    }
    .tenant-logo {
      max-width: 250px;
      max-height: 120px;
      object-fit: contain;
      margin-bottom: 10px;
    }
    h1 {
      margin: 0;
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .btn-sso {
      padding: 8px 24px;
      font-size: 1.1rem;
      border-radius: 8px;
    }
  `]
})
export class AuthHubComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private firebase = inject(InstanciaFirebase);

  private urlRetorno = '';
  public cargando = signal(false);
  public mensaje = signal('');
  public tenantNombre = signal('Copa Guia');
  public tenantLogo = signal('assets/brand/copaguia-intro.gif');

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.urlRetorno = params['retorno'] || '';
      
      if (!this.urlRetorno) {
        this.mensaje.set('Error: Falta la URL de retorno del tenant.');
        this.cargando.set(true);
      } else {
        await this.cargarBrandingTenant();
      }
    });
  }

  async cargarBrandingTenant() {
    try {
      const hostname = new URL(this.urlRetorno).hostname;
      const ref = collection(this.firebase.firestore, 'directorios');
      const q = query(ref, where('dominio', '==', hostname));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (data['nombre']) this.tenantNombre.set(data['nombre']);
        if (data['logoUrl']) this.tenantLogo.set(data['logoUrl']);
      }
    } catch (error) {
      console.error('Error cargando branding para SSO:', error);
    }
  }

  async iniciarSSO() {
    this.cargando.set(true);
    this.mensaje.set('Iniciando sesión con Google...');
    
    try {
      const user = await this.authService.loginConGoogle();
      if (!user) return; // Redireccionó o falló silenciosamente

      this.mensaje.set('Generando token seguro...');
      
      const generarTokenSSO = httpsCallable(this.firebase.functions, 'generarTokenSSO');
      
      const res = await generarTokenSSO({
        uid: user.uid,
        dominioRetorno: new URL(this.urlRetorno).hostname
      }) as any;

      const token = res.data.token;
      this.mensaje.set('Redirigiendo de vuelta al directorio...');
      
      window.location.href = `${this.urlRetorno}/auth-callback?token=${token}`;
    } catch (error: any) {
      console.error(error);
      this.mensaje.set('Error de autenticación: ' + error.message);
    }
  }
}
