// Angular Core
import { Component, OnInit, inject, OnDestroy, signal, computed, effect } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; 

// Firebase (solo el tipo `User` se importa)
import { User } from 'firebase/auth'; 
import { AuthService } from '../../firebase/auth/auth.service';
import { MatCardModule } from '@angular/material/card';

// ¡Solo un servicio!


// NO SE USA RxJS en este componente, por lo tanto, no se importan ni `Subscription` ni operadores.

@Component({
  selector: 'app-login',
  imports: [ 
    CommonModule,             
    FormsModule,
    MatCardModule,              
    MatButtonModule,          
    MatIconModule,            
    MatProgressSpinnerModule, 
    MatInputModule,           
    MatFormFieldModule        
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private router = inject(Router);
  public authService = inject(AuthService); // ¡Ahora este es el único servicio inyectado
  // --- Estados reactivos con Signals para el flujo de Login y Asignación de Username ---
  errorMessage: string = ''; 
  loading: boolean = false; 
  
  // `currentUser`: Signal que representa el usuario de Firebase logueado. 
  currentUser = this.authService.user; 
  // `isAuthLoading`: Signal computada que indica si el `AuthService` aún está verificando el estado inicial.
  isAuthLoading = computed(() => this.currentUser() === undefined);

  // --- Estados para el formulario de Username ---
  showUsernameForm: boolean = false; 
  usernameInput: string = ''; 
  usernameCheckLoading: boolean = false; 
  usernameAvailable: boolean | null = null; 
  usernameErrorMessage: string = ''; 
  usernameSuccessMessage: string = ''; 

  

  constructor() {
    effect(async () => {
      const user = this.currentUser(); 

      if (user !== undefined) {
        if (user) {
          console.log('LoginComponent: Efecto detecta usuario autenticado:', user.uid);
          try {
            // Usar el método directamente del AuthService consolidado
            const publicProfile = await this.authService.getProfileByUid(user.uid); 
            
            if (publicProfile && publicProfile.username) {
              console.log('LoginComponent: Usuario existente con username. Redirigiendo a:', publicProfile.username);
              this.router.navigate(['/profile', publicProfile.username]);
            } else {
              console.log('LoginComponent: Usuario autenticado sin username. Mostrando formulario de creación.');
              this.showUsernameForm = true;
              if (user.email) {
                this.usernameInput = user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                this.checkUsernameAvailability(true);
              }
            }
          } catch (error) {
            console.error('LoginComponent: Error al verificar el perfil público del usuario:', error);
            this.errorMessage = 'Error al cargar los datos del usuario. Por favor, intente nuevamente.';
            this.showUsernameForm = true; 
          }
        } else {
          this.showUsernameForm = false;
          console.log('LoginComponent: Efecto detecta usuario desautenticado (null).');
        }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  async loginWithGoogle(): Promise<void> {
    this.loading = true; 
    this.errorMessage = ''; 

    try {
      await this.authService.loginWithGoogle(); // Usar el método del AuthService consolidado
      console.log('LoginComponent: Login con Google completado. El flujo posterior lo gestiona el efecto de Signal.');
    } catch (error: any) {
      this.errorMessage = error.message; 
      this.showUsernameForm = false; 
      console.error('LoginComponent: Error en loginWithGoogle:', error);
    } finally {
      this.loading = false; 
    }
  }

  async checkUsernameAvailability(initialCheck: boolean = false): Promise<void> {
    this.usernameErrorMessage = ''; 
    this.usernameSuccessMessage = ''; 
    this.usernameAvailable = null; 

    if (this.usernameInput.length < 3) {
      if (!initialCheck) { 
        this.usernameErrorMessage = 'El nombre de usuario debe tener al menos 3 caracteres.';
      }
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(this.usernameInput)) { 
      this.usernameErrorMessage = 'Solo letras, números y guiones bajos (ej. mi_usuario).';
      return;
    }

    this.usernameCheckLoading = true; 
    try {
      // Usar el método del AuthService consolidado
      const taken = await this.authService.isUsernameTaken(this.usernameInput); 
      this.usernameAvailable = !taken; 
      if (taken) {
        this.usernameErrorMessage = 'Este nombre de usuario ya está en uso. Por favor, elige otro.';
      } else {
        this.usernameSuccessMessage = '¡Nombre de usuario disponible!';
      }
    } catch (error: any) {
      this.usernameErrorMessage = error.message || 'Error al verificar disponibilidad.';
      this.usernameAvailable = null; 
      console.error('LoginComponent: Error al verificar username:', error);
    } finally {
      this.usernameCheckLoading = false; 
    }
  }

  async createUsernameAndProfile(): Promise<void> {
    if (!this.currentUser()) { 
      this.errorMessage = 'No hay usuario autenticado para crear el perfil.';
      return;
    }
    if (this.usernameAvailable === null || !this.usernameAvailable) { 
      this.usernameErrorMessage = 'Por favor, verifica la disponibilidad del nombre de usuario y elige uno disponible.';
      return;
    }
    if (this.usernameInput.length < 3 || !/^[a-zA-Z0-9_]+$/.test(this.usernameInput)) {
      this.usernameErrorMessage = 'El nombre de usuario no es válido.';
      return;
    }

    this.loading = true; 
    this.usernameErrorMessage = ''; 
    this.errorMessage = ''; 

    try {
      // Usar el método del AuthService consolidado
      const profile = await this.authService.createUserProfile(this.currentUser() as User, this.usernameInput); 
      console.log('LoginComponent: Perfil de usuario creado/actualizado:', profile.username);
      this.router.navigate(['/profile', profile.username]); 
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al crear/actualizar el perfil de usuario.';
      console.error('LoginComponent: Error al crear username y perfil:', error);
    } finally {
      this.loading = false; 
    }
  }
}
