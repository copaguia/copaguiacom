// Angular Core
import { Component, inject, computed, effect, signal } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Componentes de la aplicación
import { BtnLoginGoogleComponent } from '../../components/extension/btnLoginGoogle/btnLoginGoogle.component';

// Servicios y modelos de la aplicación
import { AuthService } from '../../core/auth/auth.service';
import { StateEnum } from '../../enums/state.enum';

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
	public rutaRedireccion = signal<string>('/categorias');

	private router = inject(Router);
	public authService = inject(AuthService);

	// Signal que indica si el servicio de autenticación todavía está en su fase inicial de carga.
	isAuthLoading = computed(() => this.authService.usuarioLectura() === undefined);

	constructor() {
		effect(() => {
			// Redirige solo cuando el servicio de autenticación ha finalizado con éxito
			if (this.authService.estado() === StateEnum.EXITO) {
				this.router.navigate([this.rutaRedireccion()]);
			}
		});
	}
}
