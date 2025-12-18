// Angular Core
import { Component, inject, computed, effect, signal } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

// Servicios y modelos de la aplicación
import { AuthService } from '../../firebase/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ 
    CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule        
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
	
	errorMessage: string = ''; 
	loading: boolean = false; 
	
	// Signal que indica si el servicio de autenticación todavía está en su fase inicial de carga.
	isAuthLoading = computed(() => this.authService.usuarioLectura() === undefined);

	constructor() {
		effect(() => {
			const usuario = this.authService.usuarioLectura();
			const perfil = this.authService.perfilLectura();

			// Si el usuario está autenticado y su perfil ya ha sido cargado desde Firestore...
			if (usuario && perfil) {
				console.log('LoginComponent: Usuario y perfil detectados. Redirigiendo a la página principal.');
				this.router.navigate([this.rutaRedireccion()]);
			} else {
				console.log('LoginComponent: Esperando estado de autenticación o carga de perfil.');
			}
		});
	}

	async loginConGoogle(): Promise<void> {
		this.loading = true; 
		this.errorMessage = ''; 

		try {
			// Simplemente llamamos al método de login. 
			// El `effect` se encargará de la redirección cuando el perfil esté listo.
			await this.authService.loginConGoogle();
		} catch (error: any) {
			this.errorMessage = error.message; 
			this.loading = false; // Detenemos la carga solo si hay un error.
			console.error('LoginComponent: Error en loginConGoogle:', error);
		}
	}
}
