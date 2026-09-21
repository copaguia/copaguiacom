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


  // Signals públicas para cada rol
  
  public esVisitante:   Signal<boolean> = this.crearSignalRol(RolUsuario.VISITANTE);
  public esComerciante: Signal<boolean> = this.crearSignalRol(RolUsuario.COMERCIANTE);
  public esAgente:      Signal<boolean> = this.crearSignalRol(RolUsuario.AGENTE);
  public esAdmin:       Signal<boolean> = this.crearSignalRol(RolUsuario.ADMIN);
  
  // El rol DEV es estrictamente superior y no lo heredan los ADMIN
  public esDev:         Signal<boolean> = computed(() => 
    this.rolActual() === RolUsuario.DEV
  );

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
