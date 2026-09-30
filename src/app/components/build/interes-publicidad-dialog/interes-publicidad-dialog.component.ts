import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule
  ],
  templateUrl: './interes-publicidad-dialog.component.html',
  styleUrl: './interes-publicidad-dialog.component.css'
})
export class InteresPublicidadDialogComponent {
  
  private firestore = getFirestore(getApp());
  leadForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<InteresPublicidadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InteresData,
    private fb: FormBuilder
  ) {
    this.leadForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      nombreContacto: ['', Validators.required],
      correoCorporativo: ['', [Validators.required, Validators.email]]
    });
  }

  async contactarWhatsApp() {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    const { nombreEmpresa, nombreContacto, correoCorporativo } = this.leadForm.value;
    const telefonoAdmin = '573242380090'; 
    const mensaje = `Hola Directorio Paisa, soy *${nombreContacto}* de la empresa *${nombreEmpresa}*. Estoy interesado en ser Sponsor en el espacio "${this.data.espacio}" del directorio "${this.data.categoria}". Mi correo es: ${correoCorporativo}. ¿Me podrían dar información?`;
    
    // Guardar solicitud en Firestore
    try {
      const colRef = collection(this.firestore, 'solicitudSponsor');
      await addDoc(colRef, {
        categoria: this.data.categoria,
        espacio: this.data.espacio,
        nombreEmpresa,
        nombreContacto,
        correoCorporativo,
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
