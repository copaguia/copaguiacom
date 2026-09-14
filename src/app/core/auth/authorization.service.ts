import { computed, inject, Injectable, Signal } from '@angular/core';
import { AuthService } from './auth.service';
import { PerfilInterface } from '../../interfaces/perfil-interface';
import { RolUsuario } from './rol-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private auth = inject(AuthService);

  // Derivamos el rol y el email actual de la señal del perfil en AuthService
  private rolActual: Signal<RolUsuario | string | undefined> = computed(() => this.auth.perfilLectura()?.rolUsuario);
  private emailActual: Signal<string | undefined> = computed(() => this.auth.perfilLectura()?.email);

  // Computamos si el usuario es superusuario (para tener permisos en TODAS las vistas y probar la app)
  private esSuperUsuario = computed(() => {
    const rol = this.rolActual()?.toString().toLowerCase();
    const email = this.emailActual()?.toLowerCase();
    
    if (email === 'lidertech.net@gmail.com') return true;
    if (rol === 'developer' || rol === 'dev' || rol === 'soporte' || rol === 'admin') return true;
    return false;
  });

  // Signals públicas para cada rol
  
  public esCliente:    Signal<boolean> = this.crearSignalRol(RolUsuario.CLIENTE);
  public esDueno:      Signal<boolean> = this.crearSignalRol(RolUsuario.DUENO);
  public esRepartidor: Signal<boolean> = this.crearSignalRol(RolUsuario.REPARTIDOR);
  public esSoporte:    Signal<boolean> = this.crearSignalRol(RolUsuario.SOPORTE);
  public esAdmin:      Signal<boolean> = this.crearSignalRol(RolUsuario.ADMIN);

  /**
   * Crea una signal computada que devuelve `true` si el rol actual del usuario 
   * coincide con el rol proporcionado, o si es un superusuario.
   * @param rol El rol a verificar.
   * @returns Una signal booleana.
   */
  private crearSignalRol(rol: RolUsuario): Signal<boolean> {
    return computed(() => this.esSuperUsuario() || this.rolActual() === rol);
  }
}
