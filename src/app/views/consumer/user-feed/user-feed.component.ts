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
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService} from '../../../core/auth/auth.service';
import { PerfilInterface } from '../../../interfaces/perfil-interface';
import { PostInterface } from '../../../interfaces/post-interface';
import { ToolBarPageComponent } from '../../../components/build/tool-bar-page/tool-bar-page.component';
import { SnackbarService } from '../../../core/services/snackbar.service';

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
    ToolBarPageComponent,
    MatSnackBarModule
  ],
  templateUrl: './user-feed.component.html',
  styleUrl: './user-feed.component.css'
})
export class UserFeedComponent implements OnInit { 
  private authService = inject(AuthService); 
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);

  profileUsername = signal<string | null>(null);
  userProfile = signal<PerfilInterface | null>(null);
  loadingProfile = signal<boolean>(true);

  isEditing = signal<boolean>(false);
  editForm!: FormGroup;

  barriosCopacabana: string[] = [
    'Asunción', 'Bello Horizonte', 'Caballeros de la Virgen', 'Cristo Rey', 
    'El Recreo', 'Fátima', 'Guadalajara', 'La Azulita', 'La Misericordia', 
    'La Pedrera', 'Las Margaritas', 'Machado', 'Obrera', 'Pedregal', 
    'Quitasol', 'San Juan', 'Simón Bolívar', 'Villa Nueva', 'Yarumito', 
    'Vereda Cabuyal', 'Vereda Zarzal', 'Vereda Peñolcito'
  ].sort();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.profileUsername.set(username);
        this.loadProfile(username);
      } else {
        this.loadingProfile.set(false);
      }
    });
  }

  async loadProfile(username: string) {
    this.loadingProfile.set(true);
    try {
      if (this.isCurrentUserProfile()) {
        const p = this.authService.perfilLectura();
        if (p) {
          this.userProfile.set(p);
          this.initForm(p);
        } else {
          const pFetch = await this.authService.obtenerPerfilPorNombreUsuario(username);
          this.userProfile.set(pFetch);
          this.initForm(pFetch);
        }
      } else {
        const p = await this.authService.obtenerPerfilPorNombreUsuario(username);
        this.userProfile.set(p);
        this.initForm(p);
      }
    } catch (e) {
      console.error('Error cargando perfil:', e);
      this.userProfile.set(null);
    } finally {
      this.loadingProfile.set(false);
    }
  }

  isCurrentUserProfile(): boolean {
    const current = this.authService.perfilLectura();
    return !!current && current.nombreUsuario === this.profileUsername();
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
      
      this.snackbarService.mostrar('Tus cambios se han guardado satisfactoriamente', 'Genial');
    } catch (e) {
      console.error('Error al guardar:', e);
      this.snackbarService.mostrar('Ocurrió un error al guardar los cambios', 'Cerrar');
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
