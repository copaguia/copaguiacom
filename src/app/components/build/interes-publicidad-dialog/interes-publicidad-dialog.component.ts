import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface InteresData {
  categoria: string;
  espacio: string;
}

@Component({
  selector: 'app-interes-publicidad-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './interes-publicidad-dialog.component.html',
  styleUrl: './interes-publicidad-dialog.component.css'
})
export class InteresPublicidadDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<InteresPublicidadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InteresData
  ) {}

  contactarWhatsApp() {
    // NOTA PARA EL USUARIO: Aquí se debe poner el número real del comercial/administrador de la app
    const telefonoAdmin = '573000000000'; 
    const mensaje = `Hola, estoy interesado en alquilar el espacio publicitario "${this.data.espacio}" de la categoría "${this.data.categoria}" en Copaguía. ¿Me podrían dar información de costos?`;
    const url = `https://wa.me/${telefonoAdmin}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    this.dialogRef.close();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
