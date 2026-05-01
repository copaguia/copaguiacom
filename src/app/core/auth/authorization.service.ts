import { computed, inject, Injectable, Signal } from '@angular/core';
import { AuthService } from './auth.service';
import { PerfilInterface } from '../../interfaces/perfil-interface';
import { RolUsuario } from './rol-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private auth = inject(AuthService);

  // Derivamos el rol actual de la señal del perfil en AuthService
  private rolActual: Signal<RolUsuario | undefined> = computed(() => this.auth.perfilLectura()?.rolUsuario);

  // Signals públicas para cada rol
  
  public esCliente:    Signal<boolean> = this.crearSignalRol(RolUsuario.CLIENTE);
  public esDueno:      Signal<boolean> = this.crearSignalRol(RolUsuario.DUENO);
  public esRepartidor: Signal<boolean> = this.crearSignalRol(RolUsuario.REPARTIDOR);
  public esSoporte:    Signal<boolean> = this.crearSignalRol(RolUsuario.SOPORTE);
  public esAdmin:      Signal<boolean> = this.crearSignalRol(RolUsuario.ADMIN);

  /**
   * Crea una signal computada que devuelve `true` si el rol actual del usuario 
   * coincide con el rol proporcionado.
   * @param rol El rol a verificar.
   * @returns Una signal booleana.
   */
  private crearSignalRol(rol: RolUsuario): Signal<boolean> {
    return computed(() => this.rolActual() === rol);
  }
}
