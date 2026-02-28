import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { InstanciaFirebase } from '../core/firebase/instancias.service';
import { AuthService } from '../core/auth/auth.service';
import { RolUsuario } from '../core/auth/rol-usuario';

export const rolesGuard: CanActivateFn = async (ruta, estadoNavegacion) => {
  const instanciaFirebase = inject(InstanciaFirebase);
  const servicioAuth      = inject(AuthService);
  const enrutador         = inject(Router);
  const autenticacion     = instanciaFirebase.auth;
  
  const usuarioAutenticado = await new Promise<any>((resolver) => {
    const desuscribir = onAuthStateChanged(autenticacion, (usuario) => {
      desuscribir();
      resolver(usuario);
    });
  });

  if (!usuarioAutenticado) {
    enrutador.navigate(['/']);
    return false;
  }

  const rolesPermitidos = ruta.data['roles'] as Array<RolUsuario>;

  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const idUsuarioActual = usuarioAutenticado.uid;
    const perfilUsuario   = await servicioAuth.obtenerPerfilUsuario(idUsuarioActual);
    
    if (perfilUsuario && perfilUsuario.rolUsuario) {
      const rolActual = perfilUsuario.rolUsuario;
      
      if (rolesPermitidos.includes(rolActual)) {
        return true;
      }
    }

    enrutador.navigate(['/']);
    return false;
  }

  return true;
};





// Fin del guard rolesGuard