import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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
  
  private firestore = getFirestore(getApp());

  constructor(
    public dialogRef: MatDialogRef<InteresPublicidadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InteresData
  ) {}

  async contactarWhatsApp() {
    const telefonoAdmin = '573242380090'; 
    const mensaje = `Hola, estoy interesado en ser Sponsor en el espacio "${this.data.espacio}" del directorio "${this.data.categoria}". ¿Me podrían dar información?`;
    
    // Guardar solicitud en Firestore
    try {
      const colRef = collection(this.firestore, 'solicitudSponsor');
      await addDoc(colRef, {
        categoria: this.data.categoria,
        espacio: this.data.espacio,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      });
    } catch (e) {
      console.error('Error guardando solicitud de sponsor', e);
    }

    const url = `https://wa.me/${telefonoAdmin}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    this.dialogRef.close();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
