import { Component, computed, effect, inject, signal, OnInit, Signal } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button'; 
import { AuthService} from '../../../firebase/auth/auth.service';
import { PerfilInterface } from '../../../interfaces/perfil-interface';
import { PostInterface } from '../../../interfaces/post-interface';

@Component({
  selector: 'app-user-feed',
  standalone: true, 
  imports: [
    CommonModule,             
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatButtonModule 
  ],
  templateUrl: './user-feed.component.html',
  styleUrl: './user-feed.component.css'
})
export class UserFeedComponent implements OnInit { 
  private authService: AuthService; 
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  
  profileUsername = signal<string | null>(null);
  userProfile = signal<PerfilInterface | null>(null);
  userPosts = signal<PostInterface[]>([]);
  loadingProfile = signal<boolean>(true);
  loadingPosts = signal<boolean>(true);

  isCurrentUserProfile: Signal<boolean>;

  constructor() {
 
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username && username !== this.profileUsername()) { 
        this.profileUsername.set(username); 
      }
    });
  }

 

  /**
   * Navega de vuelta a la página principal (login).
   * Este método aún existe si lo llamas desde otros lugares, pero no está en el HTML del feed.
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  /**
   * Cierra la sesión del usuario.
   */
  async logout(): Promise<void> {
    try {
      await this.authService.desloguear();
    } catch (error) {
      console.error('Error al cerrar sesión desde UserFeed:', error);
      // Los errores se loguean, pero no se muestran al usuario.
    }
  }
}
