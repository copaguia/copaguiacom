import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login-g',
  imports: [],
  templateUrl: './login-g.component.html',
  styleUrl: './login-g.component.css'
})
export class LoginGComponent {

  private auth: any;

  constructor() {
    // Inicializa Firebase
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);

    // Maneja el resultado de la redirección
    this.handleRedirectResult();
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider(); // Crea un proveedor de Google
    await signInWithRedirect(this.auth, provider); // Redirige al usuario a la página de autenticación de Google
  }

  private async handleRedirectResult(): Promise<void> {
    try {
      const result = await getRedirectResult(this.auth); // Obtiene el resultado de la redirección
      if (result) {
        const user = result.user;
        console.log('Usuario autenticado:', user);
      }
    } catch (error) {
      console.error('Error durante la autenticación:', error);
    }
  }

}
