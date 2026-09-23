import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { UsuariosService } from '../../../core/firebase/firestore/usuarios.service';
import { RolUsuario } from '../../../core/auth/rol-usuario';
import { PerfilInterface } from '../../../interfaces/perfil-interface';

@Component({
  selector: 'app-gestor-roles-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  styles: [`
    .roles-dialog-container { background: #1e1e1e; color: #ffffff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); min-width: 320px; }
    .dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
    .dialog-title { margin: 0; display: flex; align-items: center; gap: 8px; color: #fff; font-size: 1.25rem; }
    .buscador-box { margin-top: 8px; margin-bottom: 8px; width: 100%; }
    .dialog-content-scroll { max-height: 65vh; overflow-y: auto; padding: 8px 4px !important; display: flex; flex-direction: column; gap: 12px; }
    .usuario-card { display: flex; align-items: center; justify-content: space-between; background: #2a2a2a; border-radius: 12px; padding: 12px 16px; border: 1px solid rgba(255,255,255,0.06); gap: 12px; }
    .usuario-info { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
    .avatar-wrapper { position: relative; width: 48px; height: 48px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #263238; display: flex; align-items: center; justify-content: center; border: 2px solid #37474f; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-fallback { font-weight: 700; font-size: 1.2rem; color: #81d4fa; text-transform: uppercase; }
    .usuario-detalles { display: flex; flex-direction: column; min-width: 0; gap: 3px; }
    .usuario-nombre { font-weight: 600; font-size: 0.95rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .usuario-email-box { display: flex; align-items: center; gap: 6px; color: #90caf9; font-size: 0.82rem; }
    .usuario-email-box mat-icon { font-size: 0.95rem; width: 0.95rem; height: 0.95rem; color: #90caf9; }
    .usuario-rol-actual { font-size: 0.74rem; color: #b0bec5; }
    .usuario-rol-actual strong { color: #80cbc4; text-transform: uppercase; }
    .rol-selector { width: 160px; flex-shrink: 0; margin-bottom: -1.25em; }
    .spinner-centrado { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; gap: 12px; color: #b0bec5; }
    .sin-resultados { text-align: center; color: #78909c; padding: 24px; font-size: 0.9rem; }
    @media (max-width: 600px) {
      .usuario-card { flex-direction: column; align-items: stretch; }
      .rol-selector { width: 100%; margin-top: 8px; margin-bottom: 0; }
    }
  `],
  template: `
    <div class="roles-dialog-container">
      <div class="dialog-header" mat-dialog-title>
        <h2 class="dialog-title">
          <mat-icon color="accent">manage_accounts</mat-icon>
          Gestor de Roles (DEV)
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="buscador-box">
        <mat-form-field appearance="outline" class="full-width" style="width: 100%;">
          <mat-label>Buscar usuario por nombre, email o rol</mat-label>
          <input matInput [ngModel]="usuariosService.terminoBusqueda()" (ngModelChange)="usuariosService.terminoBusqueda.set($event)" placeholder="Ej. Juan, dev, @gmail.com">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>

      <mat-dialog-content class="dialog-content-scroll">
        @if (usuariosService.cargando()) {
          <div class="spinner-centrado">
            <mat-spinner diameter="40"></mat-spinner>
            <span>Cargando lista de usuarios...</span>
          </div>
        } @else if (usuariosService.usuariosFiltrados().length === 0) {
          <div class="sin-resultados">
            <mat-icon style="font-size: 36px; height: 36px; width: 36px;">group_off</mat-icon>
            <p>No se encontraron usuarios registrados.</p>
          </div>
        } @else {
          @for (usuario of usuariosService.usuariosFiltrados(); track usuario.id) {
            <div class="usuario-card">
              <div class="usuario-info">
                <div class="avatar-wrapper">
                  @if (usuario.urlFoto && !avatarErrores()[usuario.id]) {
                    <img [src]="usuario.urlFoto" [alt]="usuario.nombreMostrado || 'Avatar'" class="avatar-img" referrerpolicy="no-referrer" (error)="registrarErrorAvatar(usuario.id)">
                  } @else {
                    <span class="avatar-fallback">{{ obtenerInicial(usuario) }}</span>
                  }
                </div>

                <div class="usuario-detalles">
                  <span class="usuario-nombre">{{ usuario.nombreMostrado || usuario.nombreUsuario || 'Sin nombre' }}</span>
                  <div class="usuario-email-box">
                    <mat-icon>email</mat-icon>
                    <span>{{ usuario.email || 'Sin correo registrado' }}</span>
                  </div>
                  <span class="usuario-rol-actual">Rol activo: <strong>{{ usuario.rolUsuario || 'visitante' }}</strong></span>
                </div>
              </div>

              <div class="rol-selector">
                @if (guardandoId() === usuario.id) {
                  <mat-spinner diameter="24"></mat-spinner>
                } @else {
                  <mat-form-field appearance="outline" class="full-width" style="width: 100%;">
                    <mat-label>Cambiar Rol</mat-label>
                    <mat-select [value]="usuario.rolUsuario || rolVisitante" (selectionChange)="onCambiarRol(usuario.id, $event.value)">
                      @for (rol of rolesDisponibles; track rol) {
                        <mat-option [value]="rol">
                          {{ rol | uppercase }}
                        </mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                }
              </div>
            </div>
          }
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end" style="margin-top: 12px; padding: 0;">
        <button mat-button mat-dialog-close color="primary">Cerrar</button>
      </mat-dialog-actions>
    </div>
  `
})
export class GestorRolesDialogComponent implements OnInit {
  public usuariosService = inject(UsuariosService);
  private snackBar        = inject(MatSnackBar);

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

  registrarErrorAvatar(id: string) {
    this.avatarErrores.update((mapa) => ({ ...mapa, [id]: true }));
  }

  obtenerInicial(usuario: PerfilInterface): string {
    const fuente = usuario.nombreMostrado || usuario.nombreUsuario || usuario.email || 'U';
    return fuente.charAt(0).toUpperCase();
  }

  async onCambiarRol(uid: string, nuevoRol: RolUsuario) {
    this.guardandoId.set(uid);
    try {
      await this.usuariosService.actualizarRolUsuario(uid, nuevoRol);
      this.snackBar.open(`Rol actualizado a "${nuevoRol.toUpperCase()}"`, 'OK', { duration: 3000 });
    } catch {
      this.snackBar.open('Error al actualizar el rol del usuario.', 'Cerrar', { duration: 4000 });
    } finally {
      this.guardandoId.set(null);
    }
  }
}
