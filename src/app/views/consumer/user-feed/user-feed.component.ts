import { Component, computed, inject, signal, OnInit, Signal } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService} from '../../../core/auth/auth.service';
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
    MatButtonModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './user-feed.component.html',
  styleUrl: './user-feed.component.css'
})
export class UserFeedComponent implements OnInit { 
  private authService = inject(AuthService); 
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  profileUsername = signal<string | null>(null);
  userProfile = signal<PerfilInterface | null>(null);
  userPosts = signal<PostInterface[]>([]);
  loadingProfile = signal<boolean>(true);
  loadingPosts = signal<boolean>(false);

  isCurrentUserProfile = computed(() => {
    const p = this.authService.perfilLectura();
    return p ? p.nombreUsuario === this.profileUsername() : false;
  });

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const username = params.get('username');
      if (username) { 
        this.profileUsername.set(username);
        this.loadingProfile.set(true);
        try {
          const p = await this.authService.obtenerPerfilPorNombreUsuario(username);
          this.userProfile.set(p);
        } catch (error) {
          console.error('Error obteniendo perfil:', error);
          this.userProfile.set(null);
        }
        this.loadingProfile.set(false);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  async logout(): Promise<void> {
    try {
      await this.authService.desloguear();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
