// Angular Core
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Servicios y Enums
import { AuthService } from '../../../core/auth/auth.service';
import { StateEnum } from '../../../enums/state.enum';

@Component({
  selector: 'app-btn-login-google',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './btnLoginGoogle.component.html',
  styleUrls: ['./btnLoginGoogle.component.css']
})
export class BtnLoginGoogleComponent {

  private authService = inject(AuthService);

  public StateEnum = StateEnum; // Para usar el enum en la plantilla
  public estado = signal<StateEnum>(StateEnum.INICIAL);
  public errorMessage = signal<string>('');

  



  async loginConGoogle(): Promise<void> {
    this.estado.set(StateEnum.AUTENTICANDO);
    this.errorMessage.set('');
    try {
      await this.authService.loginConGoogle();
            this.estado.set(StateEnum.EXITO);
    } catch (error: any) {
      this.estado.set(StateEnum.ERROR);
      this.errorMessage.set('Error al intentar iniciar sesión con Google.');
      console.error('Error en el inicio de sesión con Google:', error);
    }
  }
}
