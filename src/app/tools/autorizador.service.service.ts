import { computed, inject, Injectable, Signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { RolUsuario } from '../core/auth/rol-usuario';

@Injectable({
  providedIn: 'root'
})
export class AutorizadorService {

  /*💉*/ private readonly auth = inject(AuthService);  

  /** Señal que indica si hay un usuario autenticado. */
  public readonly isLogueado = computed(() => !!this.auth.usuarioLectura());   
  
  /** Señal privada que obtiene el rol del usuario actual desde su perfil. */
  private readonly rolActual = computed(() => this.auth.perfilLectura()?.rolUsuario); 

  // --- SEÑALES DE ROLES PARA LA APP ---

  /** `true` si el usuario no está logueado (es un visitante). */
  public readonly esVisitante: Signal<boolean> = computed(() => this.rolActual() === undefined);

  /** `true` si el rol del usuario es ADMIN. */
  public readonly esAdmin: Signal<boolean> = computed(() => this.rolActual() === RolUsuario.ADMIN);

  /** `true` si el rol del usuario es SOPORTE. */
  public readonly esSoporte: Signal<boolean> = computed(() => this.rolActual() === RolUsuario.SOPORTE);

  /** `true` si el rol del usuario es DUENO (dueño de negocio). */
  public readonly esDueno: Signal<boolean> = computed(() => this.rolActual() === RolUsuario.DUENO);

  /** `true` si el rol del usuario es CLIENTE. */
  public readonly esCliente: Signal<boolean> = computed(() => this.rolActual() === RolUsuario.CLIENTE);

  /** `true` si el rol del usuario es REPARTIDOR. */
  public readonly esRepartidor: Signal<boolean> = computed(() => this.rolActual() === RolUsuario.REPARTIDOR);

}
