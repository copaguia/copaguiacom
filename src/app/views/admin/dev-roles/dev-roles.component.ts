import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuariosService } from '../../../core/firebase/firestore/usuarios.service';
import { RolUsuario } from '../../../core/auth/rol-usuario';
import { PerfilInterface } from '../../../interfaces/perfil-interface';

@Component({
  selector: 'app-dev-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  styles: [`
    .roles-page-container { min-height: 100vh; background: #121212; color: #ffffff; padding: 24px 16px; box-sizing: border-box; }
    .roles-inner { max-width: 960px; margin: 0 auto; }
    .roles-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; }
    .roles-titulo-box { display: flex; align-items: center; gap: 12px; }
    .roles-titulo { margin: 0; font-size: 1.5rem; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 10px; }
    .btn-volver { color: #ffffff !important; }
    .buscador-card { background: #1e1e1e !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 12px; margin-bottom: 20px; padding: 8px 16px; }
    .buscador-card mat-form-field { width: 100%; margin-bottom: -1.25em; }
    .usuarios-lista { display: flex; flex-direction: column; gap: 14px; }
    .usuario-card { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-radius: 14px; background: #1e1e1e; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4); gap: 16px; flex-wrap: wrap; }
    .usuario-info { display: flex; align-items: center; gap: 16px; min-width: 240px; flex: 1; }
    .avatar-wrapper { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; background: #263238; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid #37474f; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-fallback { font-size: 1.4rem; font-weight: 700; color: #81d4fa; text-transform: uppercase; }
    .usuario-datos { display: flex; flex-direction: column; min-width: 0; gap: 4px; }
    .usuario-nombre { font-size: 1.05rem; font-weight: 600; color: #ffffff; }
    .usuario-email-box { display: flex; align-items: center; gap: 6px; color: #90caf9; font-size: 0.88rem; }
    .usuario-email-box mat-icon { font-size: 1rem; width: 1rem; height: 1rem; color: #90caf9; }
    .usuario-meta { font-size: 0.78rem; color: #b0bec5; }
    .usuario-meta strong { color: #80cbc4; text-transform: uppercase; }
    .rol-box { width: 190px; flex-shrink: 0; margin-bottom: -1.25em; }
    .spinner-caja { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 16px; color: #b0bec5; }
    .vacio-box { text-align: center; padding: 60px 20px; color: #78909c; }
    @media (max-width: 600px) {
      .usuario-card { flex-direction: column; align-items: stretch; }
      .rol-box { width: 100%; margin-top: 12px; margin-bottom: 0; }
    }
  `],
  template: `
    <main class="roles-page-container">
      <div class="roles-inner">
        <header class="roles-header">
          <div class="roles-titulo-box">
            <button mat-icon-button class="btn-volver" (click)="regresar()" matTooltip="Volver al Dev Dashboard">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="roles-titulo">
              <mat-icon color="accent">manage_accounts</mat-icon>
              Gestor de Roles (DEV)
            </h1>
          </div>
          <button mat-flat-button color="primary" (click)="recargarUsuarios()">
            <mat-icon>refresh</mat-icon>
            Actualizar
          </button>
        </header>

        <mat-card class="buscador-card">
          <mat-form-field appearance="outline">
            <mat-label>Buscar por nombre, correo o rol</mat-label>
            <input matInput [ngModel]="usuariosService.terminoBusqueda()" (ngModelChange)="usuariosService.terminoBusqueda.set($event)" placeholder="Ej. Juan, dev, admin...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
        </mat-card>

        @if (usuariosService.cargando()) {
          <div class="spinner-caja">
            <mat-spinner diameter="44"></mat-spinner>
            <span>Cargando lista de usuarios...</span>
          </div>
        } @else if (usuariosService.usuariosFiltrados().length === 0) {
          <div class="vacio-box">
            <mat-icon style="font-size: 48px; height: 48px; width: 48px;">group_off</mat-icon>
            <p>No se encontraron usuarios registrados.</p>
          </div>
        } @else {
          <section class="usuarios-lista">
            @for (usuario of usuariosService.usuariosFiltrados(); track usuario.id) {
              <article class="usuario-card">
                <div class="usuario-info">
                  <div class="avatar-wrapper">
                    @if (usuario.urlFoto && !avatarErrores()[usuario.id]) {
                      <img [src]="usuario.urlFoto" [alt]="usuario.nombreMostrado || 'Avatar'" class="avatar-img" referrerpolicy="no-referrer" (error)="registrarErrorAvatar(usuario.id)">
                    } @else {
                      <span class="avatar-fallback">{{ obtenerInicial(usuario) }}</span>
                    }
                  </div>

                  <div class="usuario-datos">
                    <span class="usuario-nombre">{{ usuario.nombreMostrado || usuario.nombreUsuario || 'Sin nombre registrado' }}</span>
                    <div class="usuario-email-box">
                      <mat-icon>email</mat-icon>
                      <span>{{ usuario.email || 'Sin correo asociado' }}</span>
                    </div>
                    <span class="usuario-meta">Rol actual: <strong>{{ usuario.rolUsuario || 'visitante' }}</strong></span>
                  </div>
                </div>

                <div class="rol-box">
                  @if (guardandoId() === usuario.id) {
                    <mat-spinner diameter="24"></mat-spinner>
                  } @else {
                    <mat-form-field appearance="outline" style="width: 100%;">
                      <mat-label>Rol Asignado</mat-label>
                      <mat-select [value]="usuario.rolUsuario || rolVisitante" (selectionChange)="cambiarRol(usuario.id, $event.value)">
                        @for (rol of rolesDisponibles; track rol) {
                          <mat-option [value]="rol">
                            {{ rol | uppercase }}
                          </mat-option>
                        }
                      </mat-select>
                    </mat-form-field>
                  }
                </div>
              </article>
            }
          </section>
        }
      </div>
    </main>
  `
})
export class DevRolesComponent implements OnInit {
  public usuariosService = inject(UsuariosService);
  private snackBar        = inject(MatSnackBar);
  private router          = inject(Router);

  public readonly rolVisitante = RolUsuario.VISITANTE;
  public readonly rolesDisponibles: RolUsuario[] = [
    RolUsuario.VISITANTE,
    RolUsuario.COMERCIANTE,
    RolUsuario.AGENTE,
    RolUsuario.ADMIN,
    RolUsuario.DEV
  ];

  public guardandoId   = signal<string | null>(null);
  public avatarErrores = signal<Record<string, boolean>>({});

  ngOnInit() {
    this.usuariosService.cargarUsuarios();
  }

  recargarUsuarios() {
    this.usuariosService.cargarUsuarios();
  }

  registrarErrorAvatar(id: string) {
    this.avatarErrores.update((mapa) => ({ ...mapa, [id]: true }));
  }

  obtenerInicial(usuario: PerfilInterface): string {
    const fuente = usuario.nombreMostrado || usuario.nombreUsuario || usuario.email || 'U';
    return fuente.charAt(0).toUpperCase();
  }

  regresar() {
    this.router.navigate(['/admin/dev-dashboard']);
  }

  async cambiarRol(uid: string, nuevoRol: RolUsuario) {
    this.guardandoId.set(uid);
    try {
      await this.usuariosService.actualizarRolUsuario(uid, nuevoRol);
      this.snackBar.open(`Rol actualizado a "${nuevoRol.toUpperCase()}"`, 'OK', { duration: 3000 });
    } catch {
      this.snackBar.open('Error al actualizar rol de usuario.', 'Cerrar', { duration: 4000 });
    } finally {
      this.guardandoId.set(null);
    }
  }
}
