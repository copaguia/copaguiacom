import { Component, computed, effect, inject, signal, OnInit, Signal } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button'; 
import { AuthService, Post, PublicUserProfile } from '../../../firebase/auth/auth.service';

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

  // --- Signals para el estado del componente ---
  profileUsername = signal<string | null>(null);
  userProfile = signal<PublicUserProfile | null>(null);
  userPosts = signal<Post[]>([]);
  loadingProfile = signal<boolean>(true);
  loadingPosts = signal<boolean>(true);
  // errorMessage: Se ha eliminado para no manejar errores en la UI

  isCurrentUserProfile: Signal<boolean>;

  constructor() {
    this.authService = inject(AuthService); 

    this.isCurrentUserProfile = computed(() => {
      const currentAuthUser = this.authService.user(); 
      const profileUser = this.userProfile(); 
      return !!currentAuthUser && !!profileUser && currentAuthUser.uid === profileUser.uid;
    });

    effect(() => {
      const username = this.profileUsername(); 

      if (username) {
        this.loadUserProfileAndPosts(username);
      } else {
        // Limpiar estado si no hay username en la ruta
        this.userProfile.set(null);
        this.userPosts.set([]);
        this.loadingProfile.set(false);
        this.loadingPosts.set(false);
      }
    }, { allowSignalWrites: true }); 
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
   * Carga el perfil público y las publicaciones de un usuario dado su username.
   * Los errores se registran en consola pero no se muestran en la UI.
   */
  private async loadUserProfileAndPosts(username: string): Promise<void> {
    this.loadingProfile.set(true);
    this.loadingPosts.set(true);
    this.userProfile.set(null); 
    this.userPosts.set([]);   

    try {
      const profile = await this.authService.getProfileByUsername(username); 

      if (profile) {
        this.userProfile.set(profile);
        console.log('UserFeedComponent: Perfil cargado para:', profile.username);

        const posts = await this.authService.getUserPosts(profile.uid); 
        this.userPosts.set(posts);
        console.log('UserFeedComponent: Posts cargados:', posts.length);

      } else {
        console.warn(`UserFeedComponent: Perfil no encontrado para @${username}.`);
        // Si el perfil no se encuentra, no se muestra nada, o se podría redirigir si se prefiere
        // this.router.navigate(['/home']); 
      }
    } catch (error: any) {
      console.error('UserFeedComponent: Error al cargar perfil/posts (no visible en UI):', error);
      // Los errores se capturan y loguean, pero no afectan directamente la UI.
    } finally {
      this.loadingProfile.set(false);
      this.loadingPosts.set(false);
    }
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
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión desde UserFeed:', error);
      // Los errores se loguean, pero no se muestran al usuario.
    }
  }
}
