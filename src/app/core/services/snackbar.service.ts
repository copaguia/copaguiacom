import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  mostrar(mensaje: string, accion: string = 'Cerrar', duracion: number = 3000): void {
    this.snackBar.open(mensaje, accion, {
      duration: duracion,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
