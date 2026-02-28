// Angular Core
import { Component, inject, computed, effect, signal } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Componentes de la aplicación
import { BtnLoginGoogleComponent } from '../../components/btnLoginGoogle/btnLoginGoogle.component';

// Servicios y modelos de la aplicación
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ 
    CommonModule, 
    MatCardModule,
    MatProgressSpinnerModule,
    BtnLoginGoogleComponent
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  	public logo = 'assets/brand/copaguia-intro.gif';
	public mensaje = 'Bienvenido a Copa Guia';
	public rutaRedireccion = signal<string>('/nav-menu');

	private router = inject(Router);
	public authService = inject(AuthService);

	// Signal que indica si el servicio de autenticación todavía está en su fase inicial de carga.
	isAuthLoading = computed(() => this.authService.usuarioLectura() === undefined);

	constructor() {
		effect(() => {
			const usuario = this.authService.usuarioLectura();
			const perfil = this.authService.perfilLectura();

			if (usuario && perfil) {
				this.router.navigate([this.rutaRedireccion()]);
			} 
		});
	}
}
