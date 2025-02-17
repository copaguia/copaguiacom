import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // El usuario está logueado, permite el acceso
      return true;
    } else {
      // El usuario no está logueado, redirige a la ruta de login
      this.router.navigate(['/']); // Puedes cambiar '/' por la ruta de login si tienes una
      return false;
    }
  }
}

/**
 
Explicación del Guard:

@Injectable({ providedIn: 'root' }): Hace que el Guard sea un servicio inyectable en toda la aplicación.
CanActivate: Implementa esta interfaz para poder usar el Guard en las rutas.
constructor(private router: Router): Inyecta el Router para poder redirigir al usuario.
canActivate(): Este método es el que se ejecuta cuando se intenta acceder a una ruta protegida.
const auth = getAuth();: Obtiene la instancia de autenticación de Firebase.
const user = auth.currentUser;: Obtiene el usuario actual.
if (user): Si hay un usuario logueado (user no es null), devuelve true, permitiendo el acceso.
else: Si no hay usuario logueado, redirige al usuario a la ruta raíz (/) y devuelve false, impidiendo el acceso.


 */
