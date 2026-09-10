import { Component, computed, inject, signal, OnInit, Signal } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AuthService} from '../../../core/auth/auth.service';
import { PerfilInterface } from '../../../interfaces/perfil-interface';
import { PostInterface } from '../../../interfaces/post-interface';
import { ToolBarPageComponent } from '../../../components/build/tool-bar-page/tool-bar-page.component';

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
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToolBarPageComponent
  ],
  templateUrl: './user-feed.component.html',
  styleUrl: './user-feed.component.css'
})
export class UserFeedComponent implements OnInit { 
  private authService = inject(AuthService); 
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profileUsername = signal<string | null>(null);
  userProfile = signal<PerfilInterface | null>(null);
  loadingProfile = signal<boolean>(true);

  isEditing = signal<boolean>(false);
  editForm!: FormGroup;

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
          this.initForm(p);
        } catch (error) {
          console.error('Error obteniendo perfil:', error);
          this.userProfile.set(null);
        }
        this.loadingProfile.set(false);
      }
    });
  }

  initForm(perfil: PerfilInterface | null) {
    this.editForm = this.fb.group({
      nombreMostrado: [perfil?.nombreMostrado || ''],
      biografia: [perfil?.biografia || ''],
      sexo: [perfil?.sexo || ''],
      fechaNacimiento: [perfil?.fechaNacimiento ? new Date(perfil.fechaNacimiento) : ''],
      nomenclatura: [perfil?.direccion?.nomenclatura || ''],
      barrio: [perfil?.direccion?.barrio || ''],
      municipio: [perfil?.direccion?.municipio || 'Copacabana']
    });
  }

  toggleEdit() {
    if (!this.isEditing()) {
      this.initForm(this.userProfile());
    }
    this.isEditing.set(!this.isEditing());
  }

  async saveProfile() {
    if (this.editForm.invalid) return;
    
    const val = this.editForm.value;
    const p = this.userProfile();
    if (!p) return;

    const updatedData: any = {};

    if (val.nombreMostrado !== undefined) updatedData.nombreMostrado = val.nombreMostrado;
    if (val.biografia !== undefined) updatedData.biografia = val.biografia;
    if (val.sexo !== undefined) updatedData.sexo = val.sexo;
    
    if (val.fechaNacimiento) {
      updatedData.fechaNacimiento = new Date(val.fechaNacimiento).toISOString();
    } else {
      updatedData.fechaNacimiento = null; // Firebase prefiere null a undefined
    }

    updatedData.direccion = {
      nomenclatura: val.nomenclatura || '',
      barrio: val.barrio || '',
      municipio: val.municipio || 'Copacabana'
    };

    try {
      await this.authService.actualizarPerfil(p.id, updatedData);
      
      const newP = { ...p, ...updatedData };
      this.userProfile.set(newP);
      this.isEditing.set(false);
    } catch (e) {
      console.error('Error al guardar:', e);
    }
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
